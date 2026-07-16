<template>
  <NuxtLoadingIndicator
    color="#4338ca"
    error-color="#e87963"
    :height="3"
    :throttle="120"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
