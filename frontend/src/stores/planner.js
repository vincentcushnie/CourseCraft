import { defineStore } from "pinia";
import { computed, reactive, toRaw } from "vue";
import { compileScript } from "vue/compiler-sfc";

export const usePlannerStore = defineStore("plannerStore", {
  state: () => ({
    semesters: [],
    semester_counter: 20251,
    major_one_courses: {},
    major_two_courses: {},
    course_data: {},
    courseStatus: {}, // Will store reactive values
    prereqsData: {}, // Store prerequisite data for lookup
    menus: {},
    errors: {},
    major_one_groups: {},
    major_two_groups: {},
    minor_one_courses: {},
    minor_two_courses: {},
    minor_one_groups: {},
    minor_two_groups: {},
    course_error_popup_trigger: false,
    major_minor_ids: [-1, -1, -1, -1], // stores id's of majors and minors, -1 if no id.
    overlap: [[], [], [], []],
    added_courses: {},
    wrappersArr: [],
    overlapSelect: [null, null, null, null],
    loadingPlanner: false,
  }),

  actions: {
    async setup(
      token,
      major_one_id,
      major_two_id,
      minor_one_id = -1,
      minor_two_id = -1
    ) {
      await Promise.all([
        this.getMajorCourses(major_one_id, token, 1),
        this.getMajorCourses(major_two_id, token, 2),
      ]);

      this.major_minor_ids[0] = major_one_id;
      this.major_minor_ids[1] = major_two_id;
      this.major_minor_ids[2] = minor_one_id;
      this.major_minor_ids[3] = minor_two_id;
      //ADD get semesters setup from api
      //take semesters names one by one
      //add courses with previously created functions
      if (this.semesters.length == 0) {
        const res = await fetch(`/api/semesters`, {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("semester data", data);
        data.semesters.forEach((semester, index) => {
          this.semesters.push({ name: semester.name, courses: [] });

          semester.courses.forEach((course) => {
            let courseObj = JSON.parse(course);
            this.wrappersArr = [...courseObj.wrappers];
            this.addCourse(index, courseObj, token);
          });
        });
      }
    },
    async getMajorCourses(major_id, token, number) {
      if (major_id === null) {
        return;
      }
      const res = await fetch(`/api/majors/${major_id}`, {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.errors = {};
        if (number == 1) {
          this.major_one_courses = data;
        } else {
          this.major_two_courses = data;
        }
      }
    },

    addSemester() {
      this.semesters.push({ name: this.semester_counter, courses: [] });
      if (this.semester_counter % 2 == 1) {
        this.semester_counter = this.semester_counter + 9;
      } else {
        this.semester_counter = this.semester_counter + 1;
      }
    },

    removeSemester(id) {
      // We need to first remove the courses from this semester
      // and update dependencies before removing the semester

      if (this.semesters[id] != undefined) {
        const coursesToRemove = [...this.semesters[id].courses];
        coursesToRemove.forEach((course, index) => {
          this.removeCourse(id, 0); // We keep removing the first course since they shift
        });
      }
      this.semesters.splice(id, 1);

      // Update the semester indices in courseStatus
      Object.keys(this.courseStatus).forEach((courseId) => {
        if (this.courseStatus[courseId].value > id) {
          this.courseStatus[courseId].value--;
        }
      });
    },

    async addCourse(id, course, token, expanded = false) {
      if (this.semesters.length <= id) {
        return;
      }
      const courseIdentifier =
        course.course_information.id !== null
          ? course.course_information.id
          : course.course_text;

      // Create or update the reactive semester index in courseStatus
      if (!this.courseStatus[course.course_information.id]) {
        // Create a new reactive property if it doesn't exist
        this.courseStatus[course.course_information.id] = reactive({
          value: id,
        });
      } else {
        // Update existing reactive property
        this.courseStatus[course.course_information.id].value = id;
      }

      // Fetch prerequisites if we haven't already
      if (!this.prereqsData[course.course_information.id]) {
        try {
          const res = await fetch(
            `/api/course/prereqs/courses/${course.course_information.id}`,
            {
              method: "get",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();
          console.log("prereq data", data);
          this.prereqsData[course.course_information.id] = data;

          // Make sure all prerequisite courses have a courseStatus entry
          data.forEach((prereq) => {
            if (!this.courseStatus[prereq.course_id_two]) {
              this.courseStatus[prereq.course_id_two] = reactive({
                value: 100,
              }); // Not found in any semester
            }
          });
        } catch (error) {
          console.error("Failed to fetch prerequisites:", error);
          this.prereqsData[course.course_information.id] = [];
        }
      }

      // Create a computed property that will automatically update
      // whenever any of its dependent prerequisites change
      const prerequisitesMet = computed(() => {
        const prereqs = this.prereqsData[course.course_information.id] || [];
        if (prereqs.length === 0) return true;

        // Group prerequisites by their group
        const groupedPrereqs = {};
        prereqs.forEach((prereq) => {
          if (!groupedPrereqs[prereq.group]) {
            groupedPrereqs[prereq.group] = [];
          }
          groupedPrereqs[prereq.group].push(prereq.course_id_two);
        });

        // Each group is treated as "OR", across groups is treated as "AND"
        return Object.entries(groupedPrereqs).every(([group, courseIds]) => {
          return courseIds.some((prereqId) => {
            const prereqStatus = this.courseStatus[prereqId];
            return (
              prereqStatus &&
              prereqStatus.value <
                this.courseStatus[course.course_information.id].value
            );
          });
        });
      });

      for (let i = 0; i < this.wrappersArr.length; i++) {
        if (this.wrappersArr[i].major_id == this.major_minor_ids[0]) {
          this.major_one_groups[this.wrappersArr[i].group] = true;
        }
        if (this.wrappersArr[i].major_id == this.major_minor_ids[1]) {
          this.major_two_groups[this.wrappersArr[i].group] = true;
        }
        if (this.wrappersArr[i].major_id == this.major_minor_ids[2]) {
          //this.minor_one_groups[this.wrappersArr[i].group] = true;
        }
        if (this.wrappersArr[i].major_id == this.major_minor_ids[3]) {
          //this.minor_two_groups[this.wrappersArr[i].group] = true;
        }
      }

      this.semesters[id].courses.push({
        id: courseIdentifier,
        course_information: course.course_information,
        wrappers: this.wrappersArr,
        prereqs: prerequisitesMet,
      });

      this.wrappersArr = [];
      this.overlap[0] = [];
      this.overlap[1] = [];
      this.overlap[2] = [];
      this.overlap[3] = [];
    },
    async findOverlap(course, major_number, minor_number, token) {
      console.log("course", course);
      if (course.course_information.course_code == "GENR100") {
        return;
      }
      console.log("major_number", major_number);
      console.log("wrappersArr", this.wrappersArr);
      this.loadingPlanner = true;
      //Checking for explicit overlap
      let gnrlElec1 = false;
      if (major_number != this.major_minor_ids[0]) {
        const keys = Object.keys(this.major_one_courses);

        for (const key of keys) {
          if (
            this.major_one_courses[key].course_information.id ==
              course.course_information.id &&
            !(
              this.major_one_courses[key].major_wrapper.group in
              this.major_one_groups
            )
          ) {
            this.overlap[0].push(this.major_one_courses[key]);
          } else if (
            this.major_one_courses[key].major_wrapper.course_text ==
              "General elective" &&
            !(
              this.major_one_courses[key].major_wrapper.group in
              this.major_one_groups
            ) &&
            !gnrlElec1
          ) {
            this.overlap[0].push(this.major_one_courses[key]);
            gnrlElec1 = true;
          } else if (
            this.major_one_courses[key].major_wrapper.course_text &&
            !(
              this.major_one_courses[key].major_wrapper.group in
              this.major_one_groups
            )
          ) {
            if (
              !(
                this.major_minor_ids[0] +
                  ":" +
                  this.major_one_courses[key].major_wrapper.course_text in
                this.menus
              )
            ) {
              await this.getMenu(
                token,
                this.major_one_courses[key].major_wrapper.course_text,
                this.major_minor_ids[0]
              );
            }
            for (
              let i = 0;
              i <
              this.menus[
                this.major_minor_ids[0] +
                  ":" +
                  this.major_one_courses[key].major_wrapper.course_text
              ].length;
              i++
            ) {
              if (
                this.menus[
                  this.major_minor_ids[0] +
                    ":" +
                    this.major_one_courses[key].major_wrapper.course_text
                ][i].id == course.course_information.id
              ) {
                this.overlap[0].push(this.major_one_courses[key]);
              }
            }
          }
        }
      }

      let gnrlElec2 = false;
      if (major_number != this.major_minor_ids[1]) {
        const keys = Object.keys(this.major_two_courses);

        for (const key of keys) {
          if (
            this.major_two_courses[key].course_information.id ==
              course.course_information.id &&
            !(
              this.major_two_courses[key].major_wrapper.group in
              this.major_two_groups
            )
          ) {
            this.overlap[1].push(this.major_two_courses[key]);
          } else if (
            this.major_two_courses[key].major_wrapper.course_text ==
              "General elective" &&
            !(
              this.major_two_courses[key].major_wrapper.group in
              this.major_two_groups
            ) &&
            !gnrlElec2
          ) {
            this.overlap[1].push(this.major_two_courses[key]);
            gnrlElec2 = true;
          } else if (
            this.major_two_courses[key].major_wrapper.course_text &&
            !(
              this.major_two_courses[key].major_wrapper.group in
              this.major_two_groups
            )
          ) {
            if (
              !(
                this.major_minor_ids[1] +
                  ":" +
                  this.major_two_courses[key].major_wrapper.course_text in
                this.menus
              )
            ) {
              await this.getMenu(
                token,
                this.major_two_courses[key].major_wrapper.course_text,
                this.major_minor_ids[1]
              );
            }
            for (
              let i = 0;
              i <
              this.menus[
                this.major_minor_ids[1] +
                  ":" +
                  this.major_two_courses[key].major_wrapper.course_text
              ].length;
              i++
            ) {
              if (
                this.menus[
                  this.major_minor_ids[1] +
                    ":" +
                    this.major_two_courses[key].major_wrapper.course_text
                ][i].id == course.course_information.id
              ) {
                this.overlap[1].push(this.major_two_courses[key]);
              }
            }
          }
        }
      }

      let gnrlElec3 = false;
      if (major_number != this.major_minor_ids[2]) {
        const keys = Object.keys(this.minor_one_courses);

        for (const key of keys) {
          if (
            this.minor_one_courses[key].course_information.id ==
              course.course_information.id &&
            !(
              this.minor_one_courses[key].major_wrapper.group in
              this.minor_one_groups
            )
          ) {
            this.overlap[2].push(this.minor_one_courses[key]);
          } else if (
            this.minor_one_courses[key].major_wrapper.course_text ==
              "General elective" &&
            !(
              this.minor_one_courses[key].major_wrapper.group in
              this.minor_one_groups
            ) &&
            !gnrlElec3
          ) {
            this.overlap[2].push(this.minor_one_courses[key]);
            gnrlElec3 = true;
          } else if (
            this.minor_one_courses[key].major_wrapper.course_text &&
            !(
              this.minor_one_courses[key].major_wrapper.group in
              this.minor_one_groups
            )
          ) {
            if (
              !(
                this.major_minor_ids[2] +
                  ":" +
                  this.minor_one_courses[key].major_wrapper.course_text in
                this.menus
              )
            ) {
              await this.getMenu(
                token,
                this.minor_one_courses[key].major_wrapper.course_text,
                this.major_minor_ids[2]
              );
            }
            for (
              let i = 0;
              i <
              this.menus[
                this.major_minor_ids[2] +
                  ":" +
                  this.minor_one_courses[key].major_wrapper.course_text
              ].length;
              i++
            ) {
              if (
                this.menus[
                  this.major_minor_ids[2] +
                    ":" +
                    this.minor_one_courses[key].major_wrapper.course_text
                ][i].id == course.course_information.id
              ) {
                this.overlap[2].push(this.minor_one_courses[key]);
              }
            }
          }
        }
      }

      let gnrlElec4 = false;
      if (major_number != this.major_minor_ids[3]) {
        const keys = Object.keys(this.minor_two_courses);

        for (const key of keys) {
          if (
            this.minor_two_courses[key].course_information.id ==
              course.course_information.id &&
            !(
              this.minor_two_courses[key].major_wrapper.group in
              this.minor_two_groups
            )
          ) {
            this.overlap[3].push(this.minor_two_courses[key]);
          } else if (
            this.minor_two_courses[key].major_wrapper.course_text ==
              "General elective" &&
            !(
              this.minor_two_courses[key].major_wrapper.group in
              this.minor_two_groups
            ) &&
            !gnrlElec4
          ) {
            this.overlap[3].push(this.minor_two_courses[key]);
            gnrlElec4 = true;
          } else if (
            this.minor_two_courses[key].major_wrapper.course_text &&
            !(
              this.minor_two_courses[key].major_wrapper.group in
              this.minor_two_groups
            )
          ) {
            if (
              !(
                this.major_minor_ids[3] +
                  ":" +
                  this.minor_two_courses[key].major_wrapper.course_text in
                this.menus
              )
            ) {
              await this.getMenu(
                token,
                this.minor_two_courses[key].major_wrapper.course_text,
                this.major_minor_ids[3]
              );
            }
            for (
              let i = 0;
              i <
              this.menus[
                this.major_minor_ids[3] +
                  ":" +
                  this.minor_two_courses[key].major_wrapper.course_text
              ].length;
              i++
            ) {
              if (
                this.menus[
                  this.major_minor_ids[3] +
                    ":" +
                    this.minor_two_courses[key].major_wrapper.course_text
                ][i].id == course.course_information.id
              ) {
                this.overlap[3].push(this.minor_two_courses[key]);
              }
            }
          }
        }
      }

      if (major_number != this.major_minor_ids[0]) {
        for (let i = 0; i < this.overlap[0].length; ++i) {
          let temp = Object.entries(this.major_one_courses)
            .filter(
              ([_, c]) =>
                c.major_wrapper.group === this.overlap[0][i].major_wrapper.group
            )
            .map(([_, c]) => c);
          if (temp.length === 1 && temp[0].course_information?.id != null) {
            this.overlapSelect[0] = temp[0];
            this.overlap[0].length = 0;
            break;
          }
          let counter = -1;
          for (let i = 0; i < temp.length; i++) {
            if (
              !temp[i].course_information.id ||
              !(temp[i].course_information?.id in this.courseStatus) ||
              this.courseStatus[temp[i].course_information?.id] == 100
            ) {
              if (counter == -1) {
                counter = i;
              } else {
                counter = -1;
                break;
              }
            }
          }
          if (counter != -1 && temp[counter].course_information.id) {
            this.overlapSelect[0] = temp[counter];
            this.overlap[0].length = 0;
            break;
          }
        }
      }
      if (major_number != this.major_minor_ids[1]) {
        for (let i = 0; i < this.overlap[1].length; ++i) {
          let temp = Object.entries(this.major_two_courses)
            .filter(
              ([_, c]) =>
                c.major_wrapper.group === this.overlap[1][i].major_wrapper.group
            )
            .map(([_, c]) => c);
          if (temp.length === 1 && temp[0].course_information?.id != null) {
            this.overlapSelect[1] = temp[0];
            this.overlap[1].length = 0;
            break;
          }
          let counter = -1;
          for (let i = 0; i < temp.length; i++) {
            if (
              !temp[i].course_information.id ||
              !(temp[i].course_information?.id in this.courseStatus) ||
              this.courseStatus[temp[i].course_information?.id] == 100
            ) {
              if (counter == -1) {
                counter = i;
              } else {
                counter = -1;
                break;
              }
            }
          }
          if (counter != -1) {
            this.overlapSelect[1] = temp[counter];
            this.overlap[1].length = 0;
            break;
          }
        }
      }
      if (minor_number != this.major_minor_ids[2]) {
        for (let i = 0; i < this.overlap[2].length; ++i) {
          let temp = Object.entries(this.minor_one_courses)
            .filter(
              ([_, c]) =>
                c.major_wrapper.group === this.overlap[1][i].major_wrapper.group
            )
            .map(([_, c]) => c);
          if (temp.length === 1 && temp[0].course_information?.id != null) {
            this.overlapSelect[2] = temp[0];
            this.overlap[2].length = 0;
            break;
          }
          let counter = -1;
          for (let i = 0; i < temp.length; i++) {
            if (
              !temp[i].course_information.id ||
              !(temp[i].course_information?.id in this.courseStatus) ||
              this.courseStatus[temp[i].course_information?.id] == 100
            ) {
              if (counter == -1) {
                counter = i;
              } else {
                counter = -1;
                break;
              }
            }
          }
          if (counter != -1) {
            this.overlapSelect[2] = temp[counter];
            this.overlap[2].length = 0;
            break;
          }
        }
      }
      if (minor_number != this.major_minor_ids[3]) {
        for (let i = 0; i < this.overlap[2].length; ++i) {
          let temp = Object.entries(this.minor_two_courses)
            .filter(
              ([_, c]) =>
                c.major_wrapper.group === this.overlap[1][i].major_wrapper.group
            )
            .map(([_, c]) => c);
          if (temp.length === 1 && temp[0].course_information?.id != null) {
            this.overlapSelect[3] = temp[0];
            this.overlap[3].length = 0;
            break;
          }
          let counter = -1;
          for (let i = 0; i < temp.length; i++) {
            if (
              !temp[i].course_information.id ||
              !(temp[i].course_information?.id in this.courseStatus) ||
              this.courseStatus[temp[i].course_information?.id] == 100
            ) {
              if (counter == -1) {
                counter = i;
              } else {
                counter = -1;
                break;
              }
            }
          }
          if (counter != -1) {
            this.overlapSelect[3] = temp[counter];
            this.overlap[3].length = 0;
            break;
          }
        }
      }

      this.loadingPlanner = false;
    },

    removeCourse(semesterId, courseIndex) {
      if (
        this.semesters.length <= semesterId ||
        this.semesters[semesterId].courses.length <= courseIndex
      ) {
        return;
      }

      const course = this.semesters[semesterId].courses[courseIndex];
      for (const wrapper of course.wrappers) {
        let group = wrapper.group;
        //ADD HERE
        if (wrapper.major_id == this.major_minor_ids[0]) {
          delete this.major_one_groups[group];
        }
        if (wrapper.major_id == this.major_minor_ids[1]) {
          delete this.major_two_groups[group];
        }
      }
      const courseId = course.id;

      // Remove the course from the semester
      this.semesters[semesterId].courses.splice(courseIndex, 1);

      // Update the courseStatus if needed
      // We don't delete it because other computed properties might still reference it
      // Instead, set to a high value indicating it's not in any semester
      if (
        this.courseStatus[courseId] &&
        this.courseStatus[courseId].value === semesterId
      ) {
        this.courseStatus[courseId].value = 100;
      }
    },
    async saveSemesters(token) {
      console.log("semesters", this.semesters);
      const res = await fetch(`/api/semesters`, {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(this.semesters),
      });

      const data = await res.json();
      console.log("response", data);
    },
    async getMenu(token, courseText, majorId) {
      const encodedName = encodeURIComponent(courseText.replace(/\//g, "-"));
      const res = await fetch(
        `/api/courses/menu/${encodedName}/${encodeURIComponent(majorId)}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      this.menus[majorId + ":" + courseText] = data;
    },
  },
});
