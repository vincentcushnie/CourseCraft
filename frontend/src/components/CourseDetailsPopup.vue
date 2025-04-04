<script setup>
import { defineProps, defineEmits, ref, onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { usePlannerStore } from "@/stores/planner";
import { storeToRefs } from "pinia";
const { user, user_info, major_one, major_two } = storeToRefs(useAuthStore());
const {
  major_one_courses,
  major_two_courses,
  semesters,
  courseStatus,
  mergedCourses,
} = storeToRefs(usePlannerStore());
const {
  getMajorCourses,
  addSemester,
  removeSemester,
  rearrangeSemesters,
  addCourse,
  setup,
} = usePlannerStore();

const props = defineProps({
  isVisible2: {
    type: Boolean,
    required: true,
  },
  courseSemesterId: {
    type: Number,
    required: true,
  },
  courseCourseId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update:isVisible2"]);

const closePopup = () => {
  emit("update:isVisible2", false); // Emit event to close the popup
};
</script>

<template>
  <div
    v-if="isVisible2"
    class="fixed inset-0 bg-black opacity-50 z-10"
    @click="closePopup"
  ></div>
  <div
    v-if="isVisible2"
    class="fixed top-[25%] left-[25%] w-[50%] h-[50%] border-[#A72218] bg-[#E3C5B2] border-3 z-50 flex items-center rounded-xl flex-col"
  >
    <div>
      {{
        semesters[courseSemesterId].courses[courseCourseId].course_info
          .course_name
      }}
      {{
        semesters[courseSemesterId].courses[courseCourseId].course_info
          .course_text
      }}
    </div>
    <div>
      Credits:
      {{
        semesters[courseSemesterId].courses[courseCourseId].course_info.credits
      }}
    </div>
    <div>
      Lecture:
      {{
        semesters[courseSemesterId].courses[courseCourseId].course_info.lecture
      }}
    </div>
    <div>
      Lab:
      {{ semesters[courseSemesterId].courses[courseCourseId].course_info.lab }}
    </div>
    <div>
      {{
        semesters[courseSemesterId].courses[courseCourseId].course_info.field
      }}
    </div>
    <div>
      {{
        semesters[courseSemesterId].courses[courseCourseId].course_info
          .description
      }}
    </div>
    <button @click="closePopup" class="absolute top-2 right-2 text-xl">
      X
    </button>
  </div>
</template>
