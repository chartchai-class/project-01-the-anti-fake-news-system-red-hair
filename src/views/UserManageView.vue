<script setup lang="ts">
import type { User } from '@/types';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const users = ref<User[] | null>(null)
const totalUsers = ref(0)

const route = useRoute()
const router = useRouter()

</script>