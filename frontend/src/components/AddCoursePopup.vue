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
  isVisible: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  buttonId: {
    type: Number,
    required: true,
  },
});

const searchType = ref(0);

const formData = reactive({
  added_course: null,
});

const mergedCoursesArray = ref([]);
const loading = ref(true);

onMounted(async () => {
  searchType.value = 0;
  const token = localStorage.getItem("token");
  await setup(
    token,
    user_info.value.major_one_id,
    user_info.value.major_two_id
  );

  loading.value = false;
});

const emit = defineEmits(["update:isVisible"]);

const addCourseFunction = (formData) => {
  const token = localStorage.getItem("token");

  console.log(formData.added_course);
  addCourse(props.buttonId, formData.added_course, token);
};

const handleAddClick = () => {
  if (!formData.added_course) {
    alert("Please select a course first!");
    return;
  } else {
    addCourseFunction(formData);
    closePopup();
  }
};
const closePopup = () => {
  searchType.value = 0;
  formData.added_course = null;
  emit("update:isVisible", false); // Emit event to close the popup
};
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black opacity-50 z-10"
    @click="closePopup"
  ></div>
  <div
    v-if="isVisible"
    class="fixed top-[25%] left-[25%] w-[50%] h-[50%] border-[#A72218] bg-[#E3C5B2] border-3 z-50 flex items-center rounded-xl flex-col"
  >
    <h2 class="text-3xl text-black pt-10">Add Course</h2>
    <button @click="closePopup" class="absolute top-2 right-2 text-xl">
      X
    </button>

    <div
      v-if="searchType == 0"
      class="grid grid-rows-2 grid-cols-2 w-full h-full gap-10 p-10"
    >
      <button
        @click="searchType = 1"
        class="bg-[#A72218] hover:bg-[#Eb6F46] text-white text-xl rounded-xl w-full"
      >
        From My Major
      </button>
      <button
        @click="searchType = 2"
        class="bg-[#A72218] hover:bg-[#Eb6F46] text-white text-xl rounded-xl w-full"
      >
        From My Department
      </button>
      <button
        @click="searchType = 3"
        class="bg-[#A72218] hover:bg-[#Eb6F46] text-white text-xl rounded-xl w-full"
      >
        From Core Curriculum
      </button>
      <button
        @click="searchType = 4"
        class="bg-[#A72218] hover:bg-[#Eb6F46] text-white text-xl rounded-xl w-full"
      >
        From All Courses
      </button>
    </div>
    <div v-if="searchType == 1" class="px-20 w-full">
      <p>howdy</p>
      <form @submit.prevent="addCourseFunction(formData)">
        <div class="border-1 border-black">
          <div>{{ console.log(mergedCourses) }}</div>
          <div v-if="loading">Loading...</div>
          <select v-model="formData.added_course">
            <option value="" disabled selected>Select a course</option>
            <option
              v-for="(course, key) in mergedCourses"
              :key="key"
              :value="course"
            >
              {{ course.course_code }}{{ course.course_text }}
            </option>
          </select>
        </div>
        <div v-if="formData.added_course" class="flex flex-col">
          <div>
            Course: {{ formData.added_course.course_code }}
            {{ formData.added_course.course_text }}
          </div>
          <div>Description {{ formData.added_course.description }}</div>
          <div>Credits {{ formData.added_course.credits }}</div>
          <div>Lecture Hours: {{ formData.added_course.lecture }}</div>
          <div>Lab Hours: {{ formData.added_course.lab }}</div>
        </div>
        <button
          class="my-5 mx-0 pt-1 pb-2 cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border border-black"
          @click="handleAddClick"
        >
          Add
        </button>
      </form>
      <button
        @click="searchType = 0"
        class="my-5 mx-0 pt-1 pb-2 cursor-pointer px-2 rounded-xl bg-[#Eb6F46] border border-black"
      >
        back
      </button>
    </div>
    <div v-if="searchType == 2">
      <p>good day to you sir</p>
      <button @click="searchType = 0">back</button>
    </div>
    <div v-if="searchType == 3">
      <p>g'day mate</p>
      <button @click="searchType = 0">back</button>
    </div>
    <div v-if="searchType == 4">
      <p>chalamet</p>
      <button @click="searchType = 0">back</button>
    </div>
  </div>
</template>
