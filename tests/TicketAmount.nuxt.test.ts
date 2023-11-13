import { mount } from "@vue/test-utils";
import { expect } from "vitest";

describe("TicketAmount", () => {
  it("Should exist", async () => {
    const component = await mountSuspended(TicketAmount);
    expect(component.text()).toMatchInlineSnapshot("Autoimported TicketAmount");
  });
  test("max value", () => {
    const wrapper = mount(TicketAmount, {
      props: {
        modelValue: 2,
        max: 8,
      },
    });
    expect(wrapper.props("modelValue")).toBe(2);
  });

  test("increment", async () => {
    const wrapper = mount(TicketAmount, {
      props: {
        modelValue: 2,
        max: 8,
      },
    });
    const increment = wrapper.find("increment");
    await increment.trigger("click");
    expect(wrapper.props("modelValue")).toBe(3);
  });
});
