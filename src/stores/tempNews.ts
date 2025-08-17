import { defineStore } from "pinia";
import type { News } from '@/types';

function getDefaultNews(input: Partial<News>): News{
 return{
    id: Date.now(),
    title: input.title ?? 'Newly Added News',
    category: input.category ?? 'General',
    reporter: input.reporter ?? 'Anonymous',
    newsDateTime: new Date(),
    description: input.description ?? '',
    content: input.content ?? '',
    image: input.image || 'https://i.pinimg.com/1200x/e7/f6/5b/e7f65bb7011717f5c09d900866fdff4a.jpg', //just hamster image xD
    fakeCount: 0,
    notFakeCount: 1,
    voteType: 'not-fake',
    comments: []
 }
}

export const useTempNewsStore = defineStore('tempNews',{
    state: () => ({
        list: [] as News[]
    }),
    actions: {
        addNews(input: Partial<News>){
            this.list.unshift(getDefaultNews(input));
        },
        clearNews(){
            this.list = [];
        }
    }
})