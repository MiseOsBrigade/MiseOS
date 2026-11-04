import { Router, type IRouter } from "express";
import healthRouter from "./health";
import charactersRouter from "./characters";
import departmentsRouter from "./departments";
import statsRouter from "./stats";
import dashboardRouter from "./dashboard";
import jobsRouter from "./jobs";
import approvalsRouter from "./approvals";
import webhooksRouter from "./webhooks";
import chatRouter from "./chat";
import gridRouter from "./grid";

const router: IRouter = Router();

router.use(healthRouter);
router.use(charactersRouter);
router.use(departmentsRouter);
router.use(statsRouter);
router.use(dashboardRouter);
router.use(jobsRouter);
router.use(approvalsRouter);
router.use(webhooksRouter);
router.use(chatRouter);
router.use(gridRouter);

export default router;
