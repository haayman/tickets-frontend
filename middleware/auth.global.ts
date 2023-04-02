export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth();

  console.log({ user, to });

  if (!user.value && to.meta.middleware === "auth") {
    return navigateTo("/");
  }
});
