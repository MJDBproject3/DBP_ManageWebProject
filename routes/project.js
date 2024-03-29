var express = require('express');
var router = express.Router();
const {
	role,
	project,
	employee,
	customer,
	proj_plan,
	emp_proj,
} = require('../models');

/* GET project page. */
router.get('/', function (req, res, next) {
	if (req.cookies['user'] !== undefined) {
		res.render('project', {
			user: req.cookies['user'],
			projs: req.cookies['projs'],
		});
	} else {
		res.redirect('/signIn');
	}
});

router.get('/:projID', async function (req, res, next) {
	const project_result = await project.findOne({
		raw: true,
		where: {
			PRO_ID: req.params.projID,
		},
	});
	const cus_result = await customer.findOne({
		where: { CUS_ID: project_result.CUS_ID },
	});
	const pPlan_result = await proj_plan.findAll({
		raw: true,
		where: { PRO_ID: project_result.PRO_ID },
	});
	const proj_emp_result = await emp_proj.findAll({
		raw: true,
		include: [
			{
				model: role,
			},
			{
				model: employee,
			},
		],
		where: { PRO_ID: project_result.PRO_ID },
	});
	res.render('projectDetail', {
		user: req.cookies['user'],
		proj: project_result,
		cus: cus_result,
		pPlans: pPlan_result,
		employees: proj_emp_result,
	});
});

module.exports = router;
