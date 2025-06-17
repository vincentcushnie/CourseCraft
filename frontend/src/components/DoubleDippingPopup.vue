<script setup>
import { defineProps, defineEmits, ref, onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { usePlannerStore } from "@/stores/planner";
import { storeToRefs } from "pinia";
const { user, user_info, major_one, major_two } = storeToRefs(useAuthStore());
const { major_one_courses, major_two_courses, semesters, courseStatus } =
  storeToRefs(usePlannerStore());
const {
  getMajorCourses,
  addSemester,
  removeSemester,
  rearrangeSemesters,
  addCourse,
  setup,
} = usePlannerStore();

const props = defineProps({
  isVisible3: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isVisible3"]);

const closePopup = () => {
  emit("update:isVisible3", false); // Emit event to close the popup
};
</script>

<template>
  <div v-if="isVisible3">
    Howdy! Some of the courses you have selected double dip for one of your
    other degrees/majors. Please select where you want to take the credit.
  </div>
</template>
