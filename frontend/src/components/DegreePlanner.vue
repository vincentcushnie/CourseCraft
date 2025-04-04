<script setup>
import { useAuthStore } from "@/stores/auth";
import { usePlannerStore } from "@/stores/planner";
import { storeToRefs } from "pinia";
import { VueDraggableNext as Draggable } from "vue-draggable-next";
import { onMounted, ref, reactive, computed } from "vue";
const { user, user_info, major_one, major_two } = storeToRefs(useAuthStore());
const { major_one_courses, major_two_courses, semesters, courseStatus } =
  storeToRefs(usePlannerStore());

import AddCoursePopup from "./AddCoursePopup.vue"; // Adjust path as needed
import CourseDetailsPopup from "./CourseDetailsPopup.vue"; // Adjust path as needed

const isVisible = ref(false);
const buttonId = ref(0);

const openAddCoursePopup = (id) => {
  buttonId.value = id;
  isVisible.value = true;
};

const courseSemesterId = ref(0);
const courseCourseId = ref(0);
const isVisible2 = ref(false);
const openCourseDetailsPopup = (semesterId, courseId) => {
  courseSemesterId.value = semesterId;
  courseCourseId.value = courseId;
  isVisible2.value = true;
  console.log("howdy");
};
const popupMessage = ref("This is a message passed to the popup!");
const {
  getMajorCourses,
  addSemester,
  removeSemester,
  rearrangeSemesters,
  checkCourse,
  removeCourse,
} = usePlannerStore();
const loading = ref(true);

const showMoreInfo1 = ref(false);
function toggleMoreInfo1() {
  showMoreInfo1.value = !showMoreInfo1.value;
}
const showMoreInfo2 = ref(false);
function toggleMoreInfo2() {
  showMoreInfo2.value = !showMoreInfo2.value;
}
const adjustCourseStatus = () => {};

const onMove = (event) => {
  console.log("Move Event:", event);
  console.log("Old Index:", event.moved.oldIndex);
  console.log("New Index:", event.moved.newIndex);

  if (event.moved.oldIndex > event.moved.newIndex) {
    // Moving a semester earlier (up in the list)
    console.log("Moving semester earlier");

    // Update courses in the moved semester
    const movedSemester = semesters.value[event.moved.newIndex];
    movedSemester.courses.forEach((course) => {
      if (course.id && courseStatus.value[course.id]) {
        // Subtract the difference in position
        courseStatus.value[course.id].value -=
          event.moved.oldIndex - event.moved.newIndex;
      }
    });

    // Update courses in the semesters that were shifted down
    for (let i = event.moved.newIndex + 1; i <= event.moved.oldIndex; i++) {
      const semester = semesters.value[i];
      semester.courses.forEach((course) => {
        if (course.id && courseStatus.value[course.id]) {
          courseStatus.value[course.id].value++;
        }
      });
    }
  } else if (event.moved.oldIndex < event.moved.newIndex) {
    // Moving a semester later (down in the list)
    console.log("Moving semester later");

    // Update courses in the moved semester
    const movedSemester = semesters.value[event.moved.newIndex];
    movedSemester.courses.forEach((course) => {
      if (course.id && courseStatus.value[course.id]) {
        // Add the difference in position
        courseStatus.value[course.id].value +=
          event.moved.newIndex - event.moved.oldIndex;
      }
    });

    // Update courses in the semesters that were shifted up
    for (let i = event.moved.oldIndex; i < event.moved.newIndex; i++) {
      const semester = semesters.value[i];
      semester.courses.forEach((course) => {
        if (course.id && courseStatus.value[course.id]) {
          courseStatus.value[course.id].value--;
        }
      });
    }
  } else {
    console.log("No change in position");
  }

  console.log("Updated courseStatus:", courseStatus.value);
};

onMounted(async () => {});
</script>

<template>
  <AddCoursePopup
    :isVisible="isVisible"
    @update:isVisible="isVisible = $event"
    :message="popupMessage"
    :buttonId="buttonId"
  >
  </AddCoursePopup>
  <CourseDetailsPopup
    :isVisible2="isVisible2"
    @update:isVisible2="isVisible2 = $event"
    :courseSemesterId="courseSemesterId"
    :courseCourseId="courseCourseId"
  >
  </CourseDetailsPopup>
  <div class="mx-40 my-5" v-if="user">
    <h2 class="text-[#A72218] text-4xl mb-8 text-center">Degree Planner</h2>
    <div class="flex flex-col items-center">
      <div class="flex w-full">
        <draggable v-model="semesters" class="w-full" @change="onMove">
          <transition-group>
            <div
              v-for="(value, semesterIndex) in semesters"
              :key="semesterIndex"
              class="w-full"
            >
              <div class="w-full flex flex-row bg-[#E3C5B2] rounded-xl my-6">
                <div
                  class="flex flex-row px-0 justify-between w-full col-span-25 flex-wrap"
                >
                  <div
                    v-for="(item, courseIndex) in semesters[semesterIndex]
                      .courses"
                    class="text-5xl my-3 mx-3 bg-[#E9E7E0] rounded-lg transition-colors duration-300"
                  >
                    <div class="relative w-full h-full pb-15 pt-10 px-10">
                      <button
                        class="absolute bottom-0 right-0 border-[#E9E7E0] bg-[#E3C5B2] border-b-7 border-r-7 border-l-7 text-xl pb-1 w-10 w-[50%] rounded-rl-xl"
                        @click="removeCourse(semesterIndex, courseIndex)"
                      >
                        X
                      </button>
                      <button
                        class="absolute bottom-0 left-0 border-[#E9E7E0] bg-[#E3C5B2] border-b-7 border-l-7 text-xl pb-1 w-10 w-[50%] rounded-bl-xl"
                        @click="
                          openCourseDetailsPopup(semesterIndex, courseIndex)
                        "
                      >
                        ...
                      </button>
                      <div v-if="item.prereqs" class="text-green-500">
                        {{ item.course_info.course_code }}
                        {{ item.course_info.course_text }}
                      </div>
                      <div v-else class="text-red-500">
                        {{ item.course_info.course_code }}
                        {{ item.course_info.course_text }}
                      </div>
                    </div>
                  </div>
                  <div class="grow">
                    <button
                      class="text-5xl my-3 mx-3 bg-[#E9E7E0] rounded-lg pt-6 pb-14 px-18 transition-colors duration-300 hover:bg-[#A72218] hover:text-[#E9E7E0]"
                      @click="openAddCoursePopup(semesterIndex)"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  class="text-5xl bg-[#Eb6F46] rounded-r-lg pt-4 pb-8 max-w-[300px] min-w-[15%] transition-colors duration-300 hover:bg-[#A72218] hover:text-[#E9E7E0] col-span-4"
                  @click="removeSemester(semesterIndex)"
                >
                  -
                </button>
              </div>
            </div>
          </transition-group>
        </draggable>
      </div>
      <div class="w-full">
        <button
          class="text-5xl w-full bg-[#E3C5B2] rounded-xl pt-2 pb-4 transition-colors duration-300 hover:bg-[#A72218] hover:text-[#E9E7E0]"
          @click="addSemester"
        >
          +
        </button>
      </div>
    </div>
    <button
      class="my-5 mx-0 pt-1 pb-2 cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border border-black"
    >
      Save
    </button>
  </div>
</template>
