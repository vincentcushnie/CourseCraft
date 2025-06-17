<script setup>
import { defineProps, defineEmits, ref, onMounted, reactive } from "vue";
import { usePlannerStore } from "@/stores/planner";
import { storeToRefs } from "pinia";
const { semesters, prereqsData, courseStatus, course_data } = storeToRefs(
  usePlannerStore()
);

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

const alphabet = ref(
  Array.from({ length: 10 }, (_, i) => String.fromCharCode(66 + i))
);
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
    class="fixed top-[15%] left-[15%] w-[70%] h-[70%] bg-secondary z-50 flex items-left rounded-xl flex-col overflow-y-auto"
  >
    <div class="text-4xl pt-10 text-tertiary w-full text-center">
      {{
        semesters[courseSemesterId].courses[courseCourseId].course_information
          .course_name
      }}
      {{
        semesters[courseSemesterId].courses[courseCourseId].course_information
          .course_text
      }}
    </div>
    <div class="px-20 py-6 w-full flex flex-col space-y-3">
      <div class="flex flex-row w-full">
        <div class="w-30">Course Code:</div>
        <div class="bg-background px-2 rounded-md grow">
          {{
            semesters[courseSemesterId].courses[courseCourseId]
              .course_information.course_code
          }}
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-30">Credits:</div>
        <div class="bg-background px-2 rounded-md grow">
          {{
            semesters[courseSemesterId].courses[courseCourseId]
              .course_information.credits
          }}
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-30">Lecture:</div>
        <div class="bg-background px-2 rounded-md grow">
          {{
            semesters[courseSemesterId].courses[courseCourseId]
              .course_information.lecture
          }}
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-30">Lab:</div>
        <div class="bg-background px-2 rounded-md grow">
          {{
            semesters[courseSemesterId].courses[courseCourseId]
              .course_information.lab
          }}
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-30">Department</div>
        <div class="bg-background px-2 rounded-md grow">
          {{
            semesters[courseSemesterId].courses[courseCourseId]
              .course_information.field
          }}
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-30 shrink-0 self-start">Description:</div>
        <div class="bg-background px-2 rounded-md grow">
          {{
            semesters[courseSemesterId].courses[courseCourseId]
              .course_information.description
          }}
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-30 shrink-0 self-start">Major Rules:</div>
        <div
          v-for="wrapper in semesters[courseSemesterId].courses[courseCourseId]
            .wrappers"
          class="bg-background rounded-md grow px-2"
        >
          {{ wrapper.major_course_rules }}
        </div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-30 shrink-0 self-start">Prerequisite Groups:</div>
        <div class="flex flex-col space-y-7 grow">
          <div v-for="letter in alphabet" class="flex flex-row space-x-5">
            <div
              v-for="prereq in (
                prereqsData[
                  semesters[courseSemesterId].courses[courseCourseId]
                    .course_information.id
                ] || []
              ).filter((pr) => pr.group === letter)"
              :key="prereq.id"
            >
              <div
                v-if="courseStatus[prereq.course_id_two].value == 100"
                class="rounded-md bg-background px-2"
              >
                {{ prereq.course_code }}
              </div>
              <div v-else class="rounded-md bg-tertiary text-background px-2">
                {{ prereq.course_code }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
  </div>
</template>
