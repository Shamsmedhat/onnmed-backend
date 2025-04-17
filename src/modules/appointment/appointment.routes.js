import { Router } from "express";
import { addAppointment, deleteAppointment, getAllAppointment, updateAppointment } from "./appointment.controller.js";

const appointmentRouter = Router()

appointmentRouter.route('/').post(addAppointment).get(getAllAppointment)
appointmentRouter.route('/:id').put(updateAppointment).delete(deleteAppointment)

export default appointmentRouter