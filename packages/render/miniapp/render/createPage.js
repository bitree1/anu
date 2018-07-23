import { eventSystem } from "./eventSystem";
import { render } from "react-fiber/scheduleWork";

export function createPage(PageClass, path) {
  PageClass.prototype.dispatchEvent = eventSystem.dispatchEvent
  var instance = render(React.createElement(PageClass), {
    type: "page",
    props: {
      path: path
    },
    children: [],
    root: true,
    appendChild: function(){}
  });
  console.log(instance, "instance")
  var config = {
    data: {
      state: instance.state,
      props: instance.props
    },
    dispatchEvent: eventSystem.dispatchEvent,
    onLoad: function() {
      instance.$wxPage = this;
    },
    onUnload: function() {
      instance.componentWillUnmount && instance.componentWillUnmount();
    }
  };
  (instance.allTemplateData || []).forEach(function(el) {
    if (config.data[el.templatedata]) {
      config.data[el.templatedata].push(el);
    } else {
      config.data[el.templatedata] = [el];
    }
  });
  return config;
}
