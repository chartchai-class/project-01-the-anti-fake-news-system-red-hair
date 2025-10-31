<template>
    <div class="networkError">
        <h1>Un-Oh!</h1>
        <h3>
            It looks like you're experiencing some network issue, please take a breathe and 
            <a href="#" @click="$router.go(-1)">click here</a> to try again.
        </h3>
    </div>
</template>