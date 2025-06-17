<script setup>
import { useAuthStore } from "@/stores/auth";
import { usePlannerStore } from "@/stores/planner";
import { storeToRefs } from "pinia";
import { VueDraggableNext as Draggable } from "vue-draggable-next";
import { onMounted, ref, computed } from "vue";
const { user, user_info } = storeToRefs(useAuthStore());
const { semesters, courseStatus } = storeToRefs(usePlannerStore());

import AddCoursePopup from "./AddCoursePopup.vue";
import CourseDetailsPopup from "./CourseDetailsPopup.vue";

const isVisible = ref(false);
const buttonId = ref(0);

const openAddCoursePopup = (id) => {
  buttonId.value = id;
  isVisible.value = true;
};

const courseSemesterId = ref(0);
const courseCourseId = ref(0);
const isVisible2 = ref(false);
const isVisible3 = ref(false);
const openCourseDetailsPopup = (semesterId, courseId) => {
  courseSemesterId.value = semesterId;
  courseCourseId.value = courseId;
  isVisible2.value = true;
};
const popupMessage = ref("This is a message passed to the popup!");
const {
  getMajorCourses,
  addSemester,
  removeSemester,
  rearrangeSemesters,
  checkCourse,
  removeCourse,
  saveSemesters,
  setup,
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
  if (event.moved.oldIndex > event.moved.newIndex) {
    // Moving a semester earlier (up in the list)

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
  }
};

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (
    user_info.value.major_one_id != null ||
    user_info.value.major_two_id != null
  ) {
    await setup(
      token,
      user_info.value.major_one_id,
      user_info.value.major_two_id
    );
  }

  loading.value = false;
});

const saveSemestersFunction = () => {
  const token = localStorage.getItem("token");
  saveSemesters(token);
};

const menuOpen = ref(false);
const selected = ref(null);

const rootMenu = [
  { label: "Apple" },
  {
    label: "Colors",
    children: ["Red", "Green", "Blue"].map((c) => ({ label: c })),
  },
  { label: "Banana" },
  {
    label: "Shapes",
    children: ["Circle", "Square"].map((s) => ({ label: s })),
  },
];

const menuStack = ref([rootMenu]);

const menuLevel = computed(() => menuStack.value.length); // for transition key
const currentOptions = computed(() => menuStack.value.at(-1));

function handleSelect(option) {
  if (option.children) {
    menuStack.value.push(option.children);
  } else {
    selected.value = option.label;
    menuOpen.value = false;
    menuStack.value = [rootMenu];
  }
}

function goBack() {
  if (menuStack.value.length > 1) {
    menuStack.value.pop();
  }
}
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
  <div v-if="!loading">
    <div class="mx-40 my-8" v-if="user">
      <h2 class="text-tertiary text-4xl mb-5 text-center">Degree Planner</h2>
      <div class="flex flex-col items-center">
        <div class="flex w-full">
          <draggable v-model="semesters" class="w-full" @change="onMove">
            <transition-group>
              <div
                v-for="(value, semesterIndex) in semesters"
                :key="semesterIndex"
                class="w-full"
              >
                <div class="w-full flex flex-row bg-secondary rounded-xl my-6">
                  <div
                    class="flex flex-row px-0 space-x-10 w-full col-span-25 flex-wrap"
                  >
                    <div
                      v-for="(item, courseIndex) in semesters[semesterIndex]
                        .courses"
                      class="text-5xl my-2 mx-2 bg-background w-fit rounded-lg transition-colors duration-300"
                    >
                      <div class="relative w-full h-full pb-15 pt-10 px-7">
                        <button
                          class="absolute bottom-0 right-0 border-tertiary bg-tertiary text-background border-7 rounded-br-lg text-xl pb-1 w-[20%]"
                          @click="removeCourse(semesterIndex, courseIndex)"
                        >
                          X
                        </button>
                        <button
                          class="absolute bottom-0 left-0 border-primary bg-primary border-7 rounded-bl-lg text-xl text-background pb-1 w-[80%]"
                          @click="
                            openCourseDetailsPopup(semesterIndex, courseIndex)
                          "
                        >
                          .&nbsp;.&nbsp;.
                        </button>
                        <div v-if="item.prereqs" class="text-truth">
                          {{ item.course_information.course_code }}
                          {{ item.course_information.course_text }}
                        </div>
                        <div v-else class="text-error">
                          {{ item.course_information.course_code }}
                          {{ item.course_information.course_text }}
                        </div>
                      </div>
                    </div>
                    <div class="grow">
                      <button
                        class="text-5xl my-3 mx-3 bg-background rounded-lg pt-6 pb-14 px-18 transition-colors duration-300 hover:bg-tertiary hover:text-background"
                        @click="openAddCoursePopup(semesterIndex)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    class="text-5xl bg-primary text-secondary rounded-r-lg pt-4 pb-8 max-w-[300px] min-w-[15%] transition-colors duration-300 hover:bg-tertiary hover:text-background col-span-4"
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
            class="text-5xl w-full bg-secondary rounded-xl pt-2 pb-4 transition-colors duration-300 hover:bg-tertiary hover:text-background"
            @click="addSemester"
          >
            +
          </button>
        </div>
      </div>
      <button
        @click="saveSemestersFunction()"
        class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-4 my-4 hover:bg-tertiary hover:text-background py-1"
      >
        Save
      </button>
    </div>
  </div>
  <div v-else>LOADING...</div>
</template>
