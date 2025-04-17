import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  email: { type: String, unique: false, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  // Admin or Patient
  appointmentDate: { type: Date, required: true },
  timeSlot: {
    type: String,
    required: true,
    enum: [
      '8:00 AM','9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
      '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM' , '6:00 PM', '7:00 PM'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

const appointmentUserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdBy: { type: String, unique: true, required: true },
  // Admin or Patient
  appointmentDate: { type: Date, required: true },
  timeSlot: {
    type: String,
    required: true,
    enum: [
      '8:00 AM','9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
      '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM' , '6:00 PM', '7:00 PM'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

const Appointment = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
const AppointmentUser = mongoose.models.AppointmentUser || mongoose.model("AppointmentUser", appointmentUserSchema);

export { Appointment, AppointmentUser };