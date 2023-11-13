import { mount } from "@vue/test-utils";
import inputDateVue from "../components/inputDate.vue";

it("testing props", async () => {
  expect(inputDateVue).toBeTruthy();

  const wrapper = mount(inputDateVue, {
    props: {
      modelValue: new Date(),
      type: "time",
    },
  });
  await wrapper.find(".input-date");
  expect(wrapper.props("modelValue")).toBeTruthy();
});
