import { Router } from "express";
const router = Router();

router.use((req, res, next)=>{
    next();
});
router.get("/", (req, res)=>{
    res.json({
        message: "Api funcionando"
    })
})

export default router
