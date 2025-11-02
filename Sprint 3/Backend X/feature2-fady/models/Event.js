import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    ticketType: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },

    // 🟣 Added analytics-related fields
    ticketsIssued: {
      type: Number,
      default: 0,
    },

    attendees: [
      {
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        checkedIn: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
