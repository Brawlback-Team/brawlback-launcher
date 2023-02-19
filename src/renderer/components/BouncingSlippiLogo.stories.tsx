import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { BouncingBrawlbackLogo } from "./BouncingBrawlbackLogo";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Components/BouncingBrawlbackLogo",
  component: BouncingBrawlbackLogo,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof BouncingBrawlbackLogo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BouncingBrawlbackLogo> = (args) => <BouncingBrawlbackLogo {...args} />;

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {};
