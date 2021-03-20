const express = require('express');
const router = express.Router();
const {verifyUser, verifyAdmin, authMiddleware} = require('./verifyToken');
const Work_report = require('../models/working_report');

router.use(authMiddleware);

const getCleanReport = async (id) => {
  const work_report = await Work_report.findByPk(id);
  return work_report;
}
//GET all reports
router.get('/', verifyUser, async (req, res) => {
    try{
      if(req.user.role=='User'){
        const report = await Work_report.findAll({
                where:{userId: req.user.userId}
        });
        console.log(report);
        res.json(report);
      }
      else{
        const work_report = await Work_report.findAll();
        res.json(work_report);
      }
    }
    catch(err){
      res.json({msg: err});
    }
  });

//GET report by id
router.get('/:reportId', verifyUser, async (req, res) => {
  try{
    if(req.user.role =='Admin'){
      const work_report = await getCleanReport(req.params.reportId);
      res.json(work_report);
    } 
    else {
        const work_report = await getCleanReport(req.params.reportId);
        if(work_report.userId==req.user.userId){
          res.json(work_report);
       }
      else{
        res.status(401).send('Access Denied!');
      }
    }
  }
  catch(err){
    res.json({msg: err});
  }
});

router.post('/', verifyUser,  async (req, res) => {
        try{
          if(req.user.role =='Admin'){
            res.status(401).send('Can\'t post!');
          } 
          else {
            const newReport =  await Work_report.create({
            userId: req.user.userId,
            destination: req.body.destination,
            longitude: req.body.longitude,
            latitude:req.body.latitude,
            remarks: req.body.remarks,
            date: req.body.date,
          });
           const cleanReport = await getCleanReport(newReport.id);
           res.json(cleanReport);
      }
        }
        catch(err){
          res.json({msg: err});
        }
});

router.post('/status', verifyAdmin, async (req, res)=>{
    const reportId = req.body.id;
    console.log(reportId);
    const report = await Work_report.findByPk(reportId);
    
    let status = report.status ;
    status = (status == 'unverified' ? 'verified' : 'unverified');
    await Work_report.update({status},{
        where:{
            id:reportId,
        }
    });
    res.json(report);
});


module.exports = router;