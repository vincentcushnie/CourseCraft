<script setup>
import {
  defineProps,
  defineEmits,
  ref,
  onMounted,
  reactive,
  computed,
  toRaw,
} from "vue";
import { usePlannerStore } from "@/stores/planner";
import { useCachedCourseDataStore } from "@/stores/cachedCourseData";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
const {
  major_one_courses,
  major_two_courses,
  major_one_groups,
  major_two_groups,
  major_minor_ids,
  menus,
  overlap,
  courseStatus,
  wrappersArr,
  overlapSelect,
  loadingPlanner,
} = storeToRefs(usePlannerStore());
const { major_one, major_two } = storeToRefs(useAuthStore());
const { courseDepartments, cachedDepartmentMenus } = storeToRefs(
  useCachedCourseDataStore()
);
const { addCourse, getMenu, findOverlap } = usePlannerStore();
const { setupDepartments, getDepartmentCourses } = useCachedCourseDataStore();

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
const major_identification = ref(0);
const minor_identification = ref(0);

const formData = reactive({
  added_course: null,
});
const department = ref(null);

const formDataExpanded = reactive({
  course_information: null,
});

const loading = ref(true);

onMounted(async () => {
  searchType.value = 0;
  const token = localStorage.getItem("token");
  await setupDepartments(token);
  loading.value = false;
});

const emit = defineEmits(["update:isVisible"]);

const addCourseFunction = (formData) => {
  const token = localStorage.getItem("token");
  addCourse(props.buttonId, formData.added_course, token);

  overlapSelect.value[0] = null;
  overlapSelect.value[1] = null;
  overlapSelect.value[2] = null;
  overlapSelect.value[3] = null;
};

const handleAddClick = async (major_id, minor_id) => {
  if (!formData.added_course) {
    alert("Please select a course first!");
    return;
  } else {
    const token = localStorage.getItem("token");
    await findOverlap(formData.added_course, major_id, minor_id, token);
    wrappersArr.value.push(formData.added_course.major_wrapper);

    if (
      overlap.value[0].length !== 0 ||
      overlap.value[1].length !== 0 ||
      overlap.value[2].length !== 0 ||
      overlap.value[3].length !== 0
    ) {
      searchType.value = 7;
    } else {
      submitOverlapDecisions();
    }
  }
};
const handleAddClickExpanded = async (major_id, minor_id) => {
  if (!formData.added_course) {
    formData.added_course = {};
  }
  if (!formDataExpanded.course_information) {
    alert("Please select a course first!");
    return;
  }
  const formDataCopy = structuredClone(toRaw(formData));
  formDataCopy.added_course.course_information =
    formDataExpanded.course_information;
  const token = localStorage.getItem("token");
  await findOverlap(formDataCopy.added_course, major_id, minor_id, token);
  console.log("formDataCopy: ", formDataCopy.added_course.major_wrapper);
  if (formDataCopy.added_course.major_wrapper) {
    console.log("shit");
    wrappersArr.value.push(formDataCopy.added_course.major_wrapper);
  }

  if (
    overlap.value[0].length !== 0 ||
    overlap.value[1].length !== 0 ||
    overlap.value[2].length !== 0 ||
    overlap.value[3].length !== 0
  ) {
    searchType.value = 8;
  } else {
    addCourseFunction(formDataCopy);
    closePopup();
    major_identification.value = 0;
    minor_identification.value = 0;
  }
};

const submitOverlapDecisions = () => {
  if (overlapSelect.value[0]) {
    wrappersArr.value.push(overlapSelect.value[0].major_wrapper);
  }
  if (overlapSelect.value[1]) {
    wrappersArr.value.push(overlapSelect.value[1].major_wrapper);
  }
  if (overlapSelect.value[2]) {
    wrappersArr.value.push(overlapSelect.value[2].major_wrapper);
  }
  if (overlapSelect.value[3]) {
    wrappersArr.value.push(overlapSelect.value[3].major_wrapper);
  }
  addCourseFunction(formData);
  major_identification.value = 0;
  minor_identification.value = 0;
  closePopup();
};
const submitOverlapDecisionsExpanded = () => {
  if (overlapSelect.value[0]) {
    wrappersArr.value.push(overlapSelect.value[0].major_wrapper);
  }
  if (overlapSelect.value[1]) {
    wrappersArr.value.push(overlapSelect.value[1].major_wrapper);
  }
  if (overlapSelect.value[2]) {
    wrappersArr.value.push(overlapSelect.value[2].major_wrapper);
  }
  if (overlapSelect.value[3]) {
    wrappersArr.value.push(overlapSelect.value[3].major_wrapper);
  }
  const formDataCopy = structuredClone(toRaw(formData));
  formDataCopy.added_course.course_information =
    formDataExpanded.course_information;

  addCourseFunction(formDataCopy);
  closePopup();
  major_identification.value = 0;
  minor_identification.value = 0;
};

const closePopup = () => {
  searchType.value = 0;
  formData.added_course = null;
  formDataExpanded.course_information = null;
  department.value = null;
  emit("update:isVisible", false); // Emit event to close the popup
  wrappersArr.length = 0;
  overlap.value[0] = [];
  overlap.value[1] = [];
  overlap.value[2] = [];
  overlap.value[3] = [];
  overlapSelect.value[0] = null;
  overlapSelect.value[1] = null;
  overlapSelect.value[2] = null;
  overlapSelect.value[3] = null;
};

const currentMenu = ref(null);
const courseOptions = async (major_id, minor_id) => {
  if (formData.added_course) {
    if (formData.added_course.major_wrapper.course_text) {
      const menuKey = `${formData.added_course.major_wrapper.major_id}:${formData.added_course.major_wrapper.course_text}`;
      if (menus.value[menuKey] !== undefined) {
      } else {
        const token = localStorage.getItem("token");
        await getMenu(
          token,
          formData.added_course.major_wrapper.course_text,
          formData.added_course.major_wrapper.major_id
        );
      }
      currentMenu.value = menuKey;
      searchType.value = 5;
      major_identification.value = major_id;
      minor_identification.value = minor_id;
    }
  }
};

const goBack = () => {
  searchType.value = 0;
  formData.added_course = null;
  department.value = null;
  formDataExpanded.course_information = null;
};

const goBackToDepartments = () => {
  searchType.value = 3;
  formDataExpanded.course_information = null;
  formData.added_course = null;
};

const handleSelectedDepartment = () => {
  if (!department.value) {
    alert("please select a department");
    return;
  } else if (department.value in cachedDepartmentMenus) {
  } else {
    const token = localStorage.getItem("token");
    getDepartmentCourses(department.value, token);
  }
  searchType.value = 6; //changes popup screen
};

function groupedCourseOptionsMajorOne() {
  const sorted = major_one_courses.value
    .filter(
      (course) =>
        !(course.major_wrapper.group in major_one_groups) &&
        (course.major_wrapper.course_text ||
          !(course.course_information.id in courseStatus) ||
          courseStatus[course.course_information.id].value === 100)
    )
    .sort((a, b) => a.major_wrapper.group - b.major_wrapper.group);

  let lastGroup = null;
  const result = [];

  sorted.forEach((course) => {
    const group = course.major_wrapper.group;
    if (group !== lastGroup) {
      result.push({ isDivider: true, group });
      lastGroup = group;
    }
    result.push({ ...course, isDivider: false });
  });
  console.log("result", result);

  return result;
}

function groupedCourseOptionsMajorTwo() {
  const sorted = major_two_courses.value
    .filter(
      (course) =>
        !(course.major_wrapper.group in major_two_groups) &&
        (course.major_wrapper.course_text ||
          !(course.course_information.id in courseStatus) ||
          courseStatus[course.course_information.id].value === 100)
    )
    .sort((a, b) => a.major_wrapper.group - b.major_wrapper.group);

  let lastGroup = null;
  const result = [];

  sorted.forEach((course) => {
    const group = course.major_wrapper.group;
    if (group !== lastGroup) {
      result.push({ isDivider: true, group });
      lastGroup = group;
    }
    result.push({ ...course, isDivider: false });
  });
  console.log("result", result);

  return result;
}

const groupColorMappingMajorTwo = computed(() => {
  const map = {};
  let toggle = false;
  let prev = null;

  const sortedCourses = [...major_two_courses.value].sort(
    (a, b) => a.major_wrapper.group - b.major_wrapper.group
  );
  for (const course of sortedCourses) {
    if (course.major_wrapper.group !== prev) {
      toggle = !toggle;
      prev = course.major_wrapper.group;
    }
    map[course.major_wrapper.group] = toggle ? "#E9E7E0" : "#A72218";
  }
  return map;
});

function groupToColorMajorTwo(group) {
  return groupColorMappingMajorTwo.value[group] || "#FFFFFF";
}
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black opacity-50 z-10"
    @click="closePopup"
  ></div>
  <div
    v-if="isVisible"
    class="fixed top-[15%] left-[15%] w-[70%] h-[70%] bg-secondary z-50 flex items-center rounded-xl flex-col font-inter"
  >
    <h2 class="text-4xl text-black pt-10 text-tertiary">Add Course</h2>
    <button
      @click="closePopup"
      class="absolute top-3 right-3 text-2xl cursor-pointer"
    >
      <svg
        width="40px"
        height="40px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z"
          fill="#1C274C"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z"
          fill="#1C274C"
        />
      </svg>
    </button>

    <div
      v-if="searchType == 0"
      class="grid grid-rows-2 grid-cols-2 w-full h-full gap-10 p-10"
    >
      <div v-if="major_one" class="w-full h-full">
        <button
          @click="searchType = 1"
          class="bg-tertiary border-tertiary hover:bg-secondary border-2 hover:text-tertiary text-white text-2xl rounded-xl w-full h-full flex justify-center items-center"
        >
          From {{ major_one.major_name }}
        </button>
      </div>
      <div v-else class="w-full h-full">
        <RouterLink
          :to="{ name: 'profile' }"
          class="bg-tertiary border-tertiary hover:bg-secondary h-full border-2 hover:text-tertiary text-white text-2xl rounded-xl w-full flex justify-center items-center"
        >
          Please Select a Major One
        </RouterLink>
      </div>
      <div v-if="major_two" class="w-full h-full">
        <button
          @click="searchType = 2"
          class="bg-tertiary border-tertiary hover:bg-secondary border-2 hover:text-tertiary text-white text-2xl rounded-xl w-full h-full flex justify-center items-center"
        >
          From {{ major_two.major_name }}
        </button>
      </div>
      <div v-else class="w-full h-full">
        <RouterLink
          :to="{ name: 'profile' }"
          class="bg-tertiary border-tertiary hover:bg-secondary h-full border-2 hover:text-tertiary text-white text-2xl rounded-xl w-full flex justify-center items-center"
          >Please Select a Major Two</RouterLink
        >
      </div>

      <button
        @click="searchType = 3"
        class="bg-tertiary border-tertiary hover:bg-secondary border-2 hover:text-tertiary text-white text-2xl rounded-xl w-full"
      >
        From Department
      </button>
      <button
        @click=""
        class="bg-tertiary border-tertiary hover:bg-secondary border-2 hover:text-tertiary text-white text-2xl rounded-xl w-full"
      >
        Support for minor certifications coming soon...
      </button>
    </div>
    <div v-if="searchType == 1" class="px-20 w-full py-10">
      <form @submit.prevent="handleAddClick(major_minor_ids[0], 0)">
        <div class="italic">select a course</div>
        <div class="rounded-sm bg-background">
          <div v-if="loading">Loading...</div>
          <select v-model="formData.added_course" class="w-full px-2">
            <option value="" disabled selected>Select a course</option>
            <option
              v-for="(course, key) in groupedCourseOptionsMajorOne()"
              :key="key"
              :value="course"
              :disabled="course.isDivider === true"
            >
              {{
                course && (course.course_information || course.major_wrapper)
                  ? `${course.course_information?.course_code || ""} ${
                      course.major_wrapper?.course_text || ""
                    }`.trim()
                  : "------------------"
              }}
            </option>
          </select>
        </div>
        <div v-if="formData.added_course" class="flex flex-col">
          <div
            v-if="
              formData.added_course.major_wrapper.course_text != null &&
              formData.added_course.major_wrapper.course_text !=
                'General elective'
            "
          >
            <div class="mt-3">
              Choose a course to fulfill this requirement. (Click Continue)
            </div>
            <div class="flex flex-row">
              <button
                @click="goBack()"
                class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
              >
                back
              </button>
              <button
                class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
                @click="courseOptions(major_minor_ids[0], -1)"
                type="button"
              >
                continue
              </button>
            </div>
          </div>
          <div
            v-else-if="
              formData.added_course.major_wrapper.course_text ==
              'General elective'
            "
          >
            howdy you have selected general elective.
            <div class="flex flex-row"></div>
          </div>
          <div v-else class="flex flex-col space-y-2">
            <div class="flex flex-row mt-8">
              <div class="w-40">Course:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.course_code }}
                {{ formData.added_course.course_information.course_text }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Description:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.description }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Credits:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.credits }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Lecture Hours:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.lecture }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Lab Hours:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.lab }}
              </div>
            </div>
            <div class="flex flex-row">
              <button
                @click="goBack()"
                class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
              >
                back
              </button>
              <button
                class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
                @click="submit"
              >
                add
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <button
            @click="goBack()"
            class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
          >
            back
          </button>
        </div>
      </form>
    </div>
    <div v-if="searchType == 2" class="px-20 w-full">
      <form @submit.prevent="handleAddClick(major_minor_ids[1], 0)">
        <div class="italic mt-3">select a course</div>
        <div class="bg-background rounded-sm">
          <div v-if="loading">Loading...</div>
          <select v-model="formData.added_course" class="px-2 w-full">
            <option value="" disabled selected>Select a course</option>
            <option
              v-for="(course, key) in groupedCourseOptionsMajorTwo()"
              :key="key"
              :value="course"
              :disabled="course.isDivider === true"
            >
              {{
                course && (course.course_information || course.major_wrapper)
                  ? `${course.course_information?.course_code || ""} ${
                      course.major_wrapper?.course_text || ""
                    }`.trim()
                  : "------------------"
              }}
            </option>
          </select>
        </div>
        <div v-if="formData.added_course" class="flex flex-col">
          <div
            v-if="
              formData.added_course.major_wrapper.course_text != null &&
              formData.added_course.major_wrapper.course_text !=
                'General elective'
            "
          >
            <div class="mt-3">
              Choose a course to fulfill this requirement. (Click Continue)
            </div>
            <div class="flex flex-row">
              <button
                @click="goBack()"
                class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
              >
                back
              </button>
              <button
                class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
                @click="courseOptions(major_minor_ids[1], -1)"
                type="button"
              >
                continue
              </button>
            </div>
          </div>
          <div
            v-else-if="
              formData.added_course.major_wrapper.course_text ==
              'General elective'
            "
          >
            howdy you have selected general elective.
            <div class="flex flex-row"></div>
          </div>
          <div v-else class="flex flex-col space-y-2">
            <div class="flex flex-row mt-8">
              <div class="w-40">Course:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.course_code }}
                {{ formData.added_course.course_information.course_text }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Description:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.description }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Credits:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.credits }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Lecture Hours:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.lecture }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Lab Hours:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formData.added_course.course_information.lab }}
              </div>
            </div>
            <div class="flex flex-row">
              <button
                @click="goBack()"
                class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
              >
                back
              </button>
              <button
                class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
                @click="submit"
              >
                add
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div v-if="searchType == 3" class="px-20 w-full py-10">
      <p class="italic">Please select a field:</p>
      <select v-model="department" class="w-full bg-background rounded-sm px-2">
        <option value="" disabled selected>Select a field</option>
        <option v-for="department in courseDepartments">
          {{ department }}
        </option>
      </select>

      <div class="flex flex-row">
        <button
          @click="goBack()"
          class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
        >
          back
        </button>
        <button
          @click="handleSelectedDepartment()"
          class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
        >
          continue
        </button>
      </div>
    </div>
    <div v-if="searchType == 4" class="px-20 w-full py-10">
      <p>chalamet</p>
      <button
        @click="goBack()"
        class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
      >
        back
      </button>
    </div>
    <div v-if="searchType == 5" class="px-20 w-full py-10">
      <div class="italic">select a course</div>
      <form
        @submit.prevent="
          handleAddClickExpanded(major_identification, minor_identification)
        "
        class="w-full"
      >
        <div class="rounded-sm bg-background">
          <select v-model="formDataExpanded.course_information" class="w-full">
            <option value="" disabled selected>Select a course</option>

            <option
              v-for="(course, index) in menus[currentMenu]"
              :key="index"
              :value="course"
            >
              {{ course.course_code }}
            </option>
          </select>
        </div>
        <div
          v-if="formDataExpanded.course_information"
          class="flex flex-col space-y-2 mb-3"
        >
          <div class="flex flex-row my-3">
            <div class="w-50">Description:</div>
            <div class="bg-background w-full rounded-sm px-2">
              {{ formDataExpanded.course_information.description }}
            </div>
          </div>
          <div class="flex flex-row">
            <div class="w-50">Credits:</div>
            <div class="bg-background w-full rounded-sm px-2">
              {{ formDataExpanded.course_information.credits }}
            </div>
          </div>
          <div class="flex flex-row">
            <div class="w-50">Lecture Hours:</div>
            <div class="bg-background w-full rounded-sm px-2">
              {{ formDataExpanded.course_information.lecture }}
            </div>
          </div>
          <div class="flex flex-row">
            <div class="w-50">Lab Hours:</div>
            <div class="bg-background w-full rounded-sm px-2">
              {{ formDataExpanded.course_information.lab }}
            </div>
          </div>
        </div>

        <div class="flex flex-row mt-4 w-full items-start">
          <div class="w-43 shrink-0">Major rules:</div>
          <div class="flex-1 bg-background px-2 rounded-sm">
            {{ formData.added_course.major_wrapper.major_course_rules }}
          </div>
        </div>
        <div class="flex flex-row">
          <button
            class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
            @click="submit"
          >
            Add
          </button>
          <button
            @click="goBack()"
            class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
          >
            back
          </button>
        </div>
      </form>
    </div>
    <div v-if="searchType == 6" class="px-20 w-full py-10">
      <div class="italic">select a course</div>
      <div class="w-full">
        <form
          @submit.prevent="
            handleAddClickExpanded(major_identification, minor_identification)
          "
          class="w-full"
        >
          <select
            v-model="formDataExpanded.course_information"
            class="px-2 w-full bg-background rounded-sm"
          >
            <option value="" disabled selected>Select a field</option>
            <option
              v-for="course in (cachedDepartmentMenus[department] || []).filter(
                (course) =>
                  !(course.id in courseStatus) ||
                  courseStatus[course.id].value === 100
              )"
              :key="course.course_code"
              :value="course"
            >
              {{ course.course_code }}
            </option>
          </select>
          <div
            v-if="formDataExpanded.course_information"
            class="flex flex-col space-y-2"
          >
            <div class="flex flex-row mt-4">
              <div class="w-40">Course:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formDataExpanded.course_information.course_code }}
                {{ formDataExpanded.course_information.course_text }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Description:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formDataExpanded.course_information.description }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Credits:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formDataExpanded.course_information.credits }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Lecture Hours:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formDataExpanded.course_information.lecture }}
              </div>
            </div>
            <div class="flex flex-row">
              <div class="w-40">Lab Hours:</div>
              <div class="bg-background w-full rounded-sm px-2">
                {{ formDataExpanded.course_information.lab }}
              </div>
            </div>
          </div>
          <div class="flex flex-row">
            <button
              class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
              @click="goBackToDepartments()"
            >
              back
            </button>
            <button
              class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
              @click="submit"
            >
              add
            </button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="searchType == 7" class="px-20 w-full py-10">
      <div v-if="overlap[0].length !== 0">
        <div class="my-2">
          There is potential overlap that can be accepted with
          {{ major_one.major_name }}
        </div>
        <div class="flex flex-row space-x-5">
          <div
            v-for="option in [...overlap[0], null]"
            :key="option?.id ?? 'none'"
            :class="[
              'border-2 border-tertiary  text-tertiary rounded-xl w-[20%] cursor-pointer hover:bg-tertiary',
              option === overlapSelect[0] ? 'bg-tertiary' : 'bg-secondary',
            ]"
            @click="overlapSelect[0] = option"
          >
            <div
              v-if="!option"
              class="rounded-md m-3 p-1 bg-background text-black"
            >
              <div>Don't Take Credit</div>
            </div>

            <div v-if="option">
              <div
                v-for="course in major_one_courses.filter(
                  (c) => c.major_wrapper.group === option.major_wrapper.group
                )"
                class="rounded-md m-3 p-1 bg-background text-black"
              >
                {{ course.major_wrapper.course_text }}
                {{ course.course_information.course_code }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="overlap[1].length !== 0">
        <div class="my-2">
          There is potential overlap that can be accepted with
          {{ major_two.major_name }}
        </div>
        <div class="flex flex-row space-x-5">
          <div
            v-for="option in [...overlap[1], null]"
            :key="option?.id ?? 'none'"
            :class="[
              'border-2 border-tertiary rounded-xl w-[20%] cursor-pointer hover:bg-tertiary',
              option === overlapSelect[1] ? 'bg-tertiary' : 'bg-secondary',
            ]"
            @click="overlapSelect[1] = option"
          >
            <div
              v-if="!option"
              class="rounded-md m-3 p-1 bg-background text-black"
            >
              <div>Don't Take Credit</div>
            </div>

            <div v-if="option">
              <div
                v-for="course in major_two_courses.filter(
                  (c) => c.major_wrapper.group === option.major_wrapper.group
                )"
                class="rounded-md m-3 p-1 bg-background text-black"
              >
                {{ course.major_wrapper.course_text }}
                {{ course.course_information.course_code }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="submitOverlapDecisions"
        class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
      >
        Done
      </button>
    </div>
    <div v-if="searchType == 8" class="px-20 w-full py-10">
      <div v-if="loadingPlanner">Overlap Loading</div>
      <div v-else>
        <div v-if="overlap[0].length !== 0">
          <div class="my-2">
            There is potential overlap that can be accepted with
            {{ major_one.major_name }}
          </div>
          <div class="flex flex-row space-x-5">
            <div
              v-for="option in [...overlap[0], null]"
              :key="option?.id ?? 'none'"
              :class="[
                'border-2 border-tertiary rounded-xl w-[20%] cursor-pointer hover:bg-tertiary',
                option === overlapSelect[0] ? 'bg-tertiary' : 'bg-secondary',
              ]"
              @click="overlapSelect[0] = option"
            >
              <div
                v-if="!option"
                class="rounded-md m-3 p-1 bg-background text-black"
              >
                <div>Don't Take Credit</div>
              </div>

              <div v-if="option">
                <div
                  v-for="course in major_one_courses.filter(
                    (c) => c.major_wrapper.group === option.major_wrapper.group
                  )"
                  class="bg-background rounded-md m-3 p-1"
                >
                  <div
                    v-if="
                      !(course.course_information.id in courseStatus) ||
                      courseStatus[course.course_information.id].value === 100
                    "
                    class=""
                  >
                    {{ course.course_information.course_code }}
                    {{ course.major_wrapper.course_text }}
                  </div>
                  <div v-else class="text-gray-400">
                    {{ course.major_wrapper.course_id }}
                    {{ course.course_information.course_code }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="overlap[1].length !== 0">
          <div class="my-2">
            There is potential overlap that can be accepted with
            {{ major_two.major_name }}
          </div>
          <div class="flex flex-row space-x-5">
            <div
              v-for="option in [...overlap[1], null]"
              :key="option?.id ?? 'none'"
              :class="[
                'border-2 border-tertiary rounded-xl w-[20%] cursor-pointer hover:bg-tertiary',
                option === overlapSelect[1] ? 'bg-tertiary' : 'bg-secondary',
              ]"
              @click="overlapSelect[1] = option"
            >
              <div
                v-if="!option"
                class="rounded-md m-3 p-1 bg-background text-black"
              >
                <div>Don't Take Credit</div>
              </div>

              <div v-if="option">
                <div
                  v-for="course in major_two_courses.filter(
                    (c) => c.major_wrapper.group === option.major_wrapper.group
                  )"
                  class="rounded-md m-3 p-1 bg-background text-black"
                >
                  {{ course.course_information.course_code }}
                  {{ course.major_wrapper.course_text }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        @click="submitOverlapDecisionsExpanded"
        class="px-3 text-tertiary font-inter border-2 border-tertiary rounded-lg text-center flex flex-col justify-center mx-1 my-4 hover:bg-tertiary hover:text-background py-1"
      >
        Done
      </button>
    </div>
  </div>
</template>
