import get from "axios";

type GitHubRepo = {
  name: string;
  url: string;
};
const username = "0Blackraven"

export async function getRepo(){
    try{
        const res = await get(`https://api.github.com/users/${username}/repos`);
        const repos:GitHubRepo[] = res.data;
        repos.forEach(repo =>{
            console.log(`${repo.name} , ${repo.url}`);
        })

    }catch(e){
        if(e instanceof Error){
            console.log(e.message);
        }else{
            console.log(e);
        }
    }
}