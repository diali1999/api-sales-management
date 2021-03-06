const express = require('express');
const router = express.Router();
const {verifyUser, verifyAdmin, authMiddleware} = require('./verifyToken');
const Expense_report = require('../models/expense_report');

router.use(authMiddleware);

const getCleanReport = async (id) => {
  const expense_report = await Expense_report.findByPk(id);
  return expense_report;
}
//GET all reports
router.get('/', verifyUser, async (req, res) => {
  try{
    if(req.user.role =='User'){
      console.log(req.user);
      const report = await Expense_report.findAll({
              where:{userId: req.user.userId}
      });
      console.log(report);
      res.json(report);
    }
    else{
      const report = await Expense_report.findAll();
      res.json(report);
    }
    }
    catch(err){
      console.log(err);
      res.json({msg: err});
    }
  });

//GET report by id
router.get('/:reportId', verifyUser, async (req, res) => {
  try{
    if(req.user.role =='Admin'){
      const expense_report = await getCleanReport(req.params.reportId);
      res.json(expense_report);
    } 
    else {
      if(req.params.userId == req.user.userId){
        const expense_report = await getCleanReport(req.params.reportId);
        res.json(expense_report);
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
console.log(req.body);
        try{
          console.log(req.user);
          if(req.user.role =='Admin'){
            res.status(401).send('Can\'t post!');
        } 
          else {
            console.log(req.user);
            const newReport =  await Expense_report.create({
              userId: req.user.userId,
              type: req.body.type,
              expense: req.body.expense,
              date: req.body.date,
              status: req.body.status,
              remarks:req.body.remarks,
              createdAt: new Date().getTime(),
              updatedAt: new Date().getTime(),
          });
           const cleanReport = await getCleanReport(newReport.id);
           res.json(cleanReport);
      }
    }
        catch(err){
          console.log(err);
          res.json({msg: err});
        }
});

router.post('/status', verifyAdmin, async (req, res)=>{
    const reportId = req.body.id;
    console.log(reportId);
    const report = await Expense_report.findByPk(reportId);
    
    let status = report.status ;
    status = (status == 'unverified' ? 'verified' : 'unverified');
    await Expense_report.update({status},{
        where:{
            id:reportId,
        }
    });
    res.json(report);
});
// // DELETE order by id
// router.delete('/:reportId', async (req, res) => {
//     try{
//       const expense_report = await Expense_report.findByPk(req.params.reportId);
//       await order.destroy();
//       res.json({msg: "Expense report deleted!"});
//     }
//     catch(err){
//       res.json({msg: err});
//     }
//   });

module.exports = router;