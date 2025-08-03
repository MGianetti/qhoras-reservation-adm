import chatRepository from "./chatRepository";

const { readAvailableTimeSlots, readAvailableEndTimeSlots, getUserByPhoneNumber, createClientViaChat, createSolicitationViaChat } = {
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
  getUserByPhoneNumber: async (businessId, phoneNumber) => {
    try {
      const response = await chatRepository.getUserByPhoneNumber(businessId, phoneNumber);
      return response;
    } catch (error) {
      console.error("Error getting user by phone number:", error);
      return false;
    }
  },
  createClientViaChat: async (businessId, clientData) => {
    try {
      const response = await chatRepository.createClientViaChat(businessId, clientData);
      return response;
    } catch (error) {
      console.error("Error creating client via chat:", error);
      return false;
    }
  },
  createSolicitationViaChat: async (businessId, solicitationData) => {
    try {
      const response = await chatRepository.createSolicitationViaChat(businessId, solicitationData);
      return response;
    } catch (error) {
      console.error("Error creating solicitation via chat:", error);
      return false;
    }
  }
};  

const chatService = {
  readAvailableTimeSlots,
  readAvailableEndTimeSlots,
  getUserByPhoneNumber,
  createClientViaChat,
  createSolicitationViaChat
};

export default chatService;
