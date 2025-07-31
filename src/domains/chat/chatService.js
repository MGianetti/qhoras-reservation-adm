import chatRepository from "./chatRepository";

const { readAvailableTimeSlots, readAvailableEndTimeSlots } = {
  readAvailableTimeSlots: async (roomId, date) => {
    try {
      const response = await chatRepository.readAvailableTimeSlots( roomId, date );

      return response;
    } catch (error) {
      console.error("Error reading available time slots:", error);
      return false;
    }
  },
  readAvailableEndTimeSlots: async (roomId, date, startTime) => {
    try {
      const response = await chatRepository.readAvailableEndTimeSlots(roomId, date, startTime);
      return response;
    } catch (error) {
      console.error("Error reading available end time slots:", error);
      return false;
    }
  },
};

const chatService = {
  readAvailableTimeSlots,
  readAvailableEndTimeSlots,
};

export default chatService;
