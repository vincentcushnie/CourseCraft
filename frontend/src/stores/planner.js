import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export const usePlannerStore = defineStore("plannerStore", {
  state: () => ({
    semesters: [],
    semester_counter: 20251,
    major_one_courses: {},
    major_two_courses: {},
    courseStatus: {}, // Will store reactive values
    prereqsData: {}, // Store prerequisite data for lookup
    errors: {},
    mergedCourses: {},
  }),

  actions: {
    async setup(token, major_one_id, major_two_id) {
      await Promise.all([
        this.getMajorCourses(major_one_id, token, 1),
        this.getMajorCourses(major_two_id, token, 2),
      ]);

      this.major_one_courses.forEach((course) => {
        const courseId = course.id == null ? course.course_text : course.id;
        if (
          course.id == null ||
          this.courseStatus[course.id] == undefined ||
          this.courseStatus[course.id] == 100
        ) {
          this.mergedCourses[courseId] = course;
        }
      });

      this.major_two_courses.forEach((course) => {
        const courseId = course.id == null ? course.course_text : course.id;
        if (
          course.id == null ||
          this.courseStatus[course.id] == undefined ||
          this.courseStatus[course.id] == 100
        ) {
          this.mergedCourses[courseId] = course;
        }
      });
    },
    async getMajorCourses(major_id, token, number) {
      console.log(major_id + token + number);
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
        console.log(this.errors);
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
      console.log("finished");
    },

    async addCourse(id, course, token) {
      if (this.semesters.length <= id) {
        console.log("Error in adding course function (@stores-planner.js)");
        return;
      }

      const courseIdentifier =
        course.course_id !== null ? course.course_id : course.course_text;

      // Create or update the reactive semester index in courseStatus
      if (course.course_id) {
        if (!this.courseStatus[course.course_id]) {
          // Create a new reactive property if it doesn't exist
          this.courseStatus[course.course_id] = reactive({ value: id });
        } else {
          // Update existing reactive property
          this.courseStatus[course.course_id].value = id;
        }

        // Fetch prerequisites if we haven't already
        if (!this.prereqsData[course.course_id]) {
          try {
            const res = await fetch(
              `/api/course/prereqs/courses/${course.course_id}`,
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
            this.prereqsData[course.course_id] = data;

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
            this.prereqsData[course.course_id] = [];
          }
        }

        // Create a computed property that will automatically update
        // whenever any of its dependent prerequisites change
        const prerequisitesMet = computed(() => {
          const prereqs = this.prereqsData[course.course_id] || [];
          if (prereqs.length === 0) return true;

          // Group prerequisites by their group
          const groupedPrereqs = {};
          prereqs.forEach((prereq) => {
            if (!groupedPrereqs[prereq.group]) {
              groupedPrereqs[prereq.group] = [];
            }
            groupedPrereqs[prereq.group].push(prereq.course_id_two);
          });
          console.log(groupedPrereqs);

          // Each group is treated as "OR", across groups is treated as "AND"
          return Object.entries(groupedPrereqs).every(([group, courseIds]) => {
            return courseIds.some((prereqId) => {
              const prereqStatus = this.courseStatus[prereqId];
              return (
                prereqStatus &&
                prereqStatus.value < this.courseStatus[course.course_id].value
              );
            });
          });
        });

        // Add the course with its computed prerequisite status
        this.semesters[id].courses.push({
          id: courseIdentifier,
          course_info: course,
          prereqs: prerequisitesMet,
        });
        console.log(courseIdentifier);
        console.log(this.mergedCourses[courseIdentifier]);
        if (this.mergedCourses[courseIdentifier]) console.log("deleted");
        delete this.mergedCourses[courseIdentifier];
      } else {
        // For custom courses with no course_id, always consider prerequisites met
        const alwaysMet = computed(() => true);
        this.semesters[id].courses.push({
          course_info: course,
          id: courseIdentifier,
          prereqs: alwaysMet,
        });
      }
    },

    removeCourse(semesterId, courseIndex) {
      if (
        this.semesters.length <= semesterId ||
        this.semesters[semesterId].courses.length <= courseIndex
      ) {
        console.log("Error in removing course function (@stores-planner.js)");
        return;
      }

      const course = this.semesters[semesterId].courses[courseIndex];
      const courseId = course.id;

      this.mergedCourses[course.id] = course.course_info; //adjusts major course options
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

    // For debugging and verification
    checkAllPrerequisites() {
      const issues = [];

      this.semesters.forEach((semester, semesterId) => {
        semester.courses.forEach((course, courseIndex) => {
          if (course.prereqs && !course.prereqs.value) {
            issues.push({
              semester: semesterId,
              course: course.id,
              message: "Prerequisites not met",
            });
          }
        });
      });

      return issues;
    },
  },
});
