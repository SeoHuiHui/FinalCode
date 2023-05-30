const express = require("express");
const router = new express.Router();
const conn = require("../db/conn");
const multer = require("multer");
const moment = require("moment");

// img storage confing
var imgconfig = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename:(req,file,callback)=>{
        callback(null,`image-${Date.now()}.${file.originalname}`)
    }
});

// img filter
const isImage = (req,file,callback)=>{
    if(file.mimetype.startsWith("image")){
        callback(null,true)
    }else{
        callback(null,Error("only image is allowd"))
    }
}

var upload = multer({
    storage:imgconfig,
    fileFilter:isImage
})


// register userdata
router.post("/register",upload.single("photo"),(req,res)=>{
    
    const {fprice, fseller, ftitle, fdescription} = req.body;
    
    const {filename} = req.file;

   
    if(!filename){
        res.status(422).json({status:422,message:"fill all the details"})
    }

    
    try {
        
        let date = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

        const fpw = Math.random().toString(36).substr(2,4);

        let payload ={
            //username:fname, 
            title:ftitle, seller:fseller, price:fprice, description: fdescription, password: fpw, img:filename, date:date
        };

        conn.query(`INSERT INTO productdata SET ?`,payload,(err,result)=>{
            if(err){
                console.log("error")
            }else{
                console.log("data added")
                res.status(201).json({status:201,data:req.body})
            }
        })
    } catch (error) {
        res.status(422).json({status:422,error})
    }

});

// update Product -- 판매완료
router.post("/updateProd", (req,res)=>{
    const {buyer, id} = req.body;
    try {
        conn.query(`UPDATE productdata SET buyer = '${buyer}' WHERE (id = '${id}');`
        ,(err, result)=>{
            if(err){
                console.log("error")
            }else{
                console.log("data updated")
                res.status(201).json({status:201,data:req.body})
            }
        })
    } catch (error) {
        res.status(422).json({status:422,error})
    }

});

// get general data -- 거래 안된것만
router.get("/getdata",(req,res)=>{
    try {
        conn.query("SELECT * FROM productdata WHERE buyer IS NULL;",(err,result)=>{
            if(err){
                console.log("error")
            }else{
                console.log("data get")
                res.status(201).json({status:201,data:result})
            }
        })
    } catch (error) {
        res.status(422).json({status:422,error})
    }
});

// get sell Data -- 내가 파는 것
router.get("/sellData/:account",(req,res)=>{
    const {account} = req.params;
   try {
    conn.query(`SELECT * FROM productdata WHERE seller ='${account}'`,(err,result)=>{
        if(err){
            console.log("error")
        }else{
            console.log("data", {account});
            res.status(201).json({status:201,data:result})
        }
    })
   } catch (error) {
    res.status(422).json({status:422,error})
   }
})

// get buy data -- 내가 구매한 것
router.get("/buyData/:account",(req,res)=>{
    const {account} = req.params;
   try {
    conn.query(`SELECT * FROM productdata WHERE buyer ='${account}'`,(err,result)=>{
        if(err){
            console.log("error")
        }else{
            console.log("data", {account});
            res.status(201).json({status:201,data:result})
        }
    })
   } catch (error) {
    res.status(422).json({status:422,error})
   }
})

// delete product
router.delete("/:id",(req,res)=>{
    const {id} = req.params;
   try {
    conn.query(`DELETE FROM productdata WHERE id ='${id}'`,(err,result)=>{
        if(err){
            console.log("error")
        }else{
            console.log("data delete")
            res.status(201).json({status:201,data:result})
        }
    })
   } catch (error) {
    res.status(422).json({status:422,error})
   }
})

//get certain product
router.get("/:id",(req,res)=>{
    const {id} = req.params;
   try {
    conn.query(`SELECT * FROM productdata WHERE id ='${id}'`,(err,result)=>{
        if(err){
            console.log("error")
        }else{
            console.log("data", {id});
            res.status(201).json({status:201,data:result})
        }
    })
   } catch (error) {
    res.status(422).json({status:422,error})
   }
})


module.exports = router;