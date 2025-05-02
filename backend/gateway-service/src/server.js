import {app} from "./app.js";

app.listen(process.env.PORT, ()=>{
    console.log(`Server listning at port:: ${process.env.PORT}`);
})
