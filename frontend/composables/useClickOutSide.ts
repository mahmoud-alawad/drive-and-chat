interface UseOutSideInterface {
  (components: Ref[], callBack: () => void, trigger?: Ref): {};
}

export const useClickOutSide: UseOutSideInterface = (
  components,
  callBack,
  trigger
) => {
  console.log(components);

  const listner = (event: Event) => {
    event.stopPropagation();

    if (trigger && trigger.value) {
      if (
        Array.from(components).some(
          (element) => element.value === event.target
        ) || trigger?.value
          ? event.target === trigger?.value
          : true
      ) {
        return { listner, ...components };
      }
    }

    if (
      Array.from(components).some((element) => element.value === event.target)
    ) {
      return { listner, ...components };
    }

    if (typeof callBack === "function") {
      callBack();
    }
  };

  onMounted(() => {
    window.addEventListener("click", listner);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("click", listner);
  });

  return { listner, ...components };
};
