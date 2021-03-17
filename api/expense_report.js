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
router.get('/', verifyAdmin, async (req, res) => {
    try{
      const expense_report = await Expense_report.findAll();
      res.json(expense_report);
    }
    catch(err){
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
      if(req.params.userId == req.user.id){
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
        try{
          if(req.user.role =='Admin'){
            res.status(401).send('Can\'t post!');
        } 
          else {
            if(req.params.userId == req.user.id){
            const newReport =  await Expense_report.create({
              user_id: req.user.userId,
              type: req.body.type,
              expense: req.body.expense,
              date: req.body.date,
              status: req.body.status,
              createdAt: new Date().getTime(),
              updatedAt: new Date().getTime(),
          });
           const cleanReport = await getCleanReport(newReport.id);
           res.json(cleanReport);
        }
      }
    }
        catch(err){
          res.json({msg: err.errors[0].message});
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