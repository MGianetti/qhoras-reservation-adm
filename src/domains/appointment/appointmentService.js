import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import store from "../../infraestructure/store/store";
import notification from "../../common/utils/notification";
import appointmentRepository from "./appointmentRepository";
import {
  readItem,
  addItem,
  updateItem,
  removeItem,
  setLoading,
} from "./appointmentSlice";

import {
  createdAppointmentSuccess,
  createdAppointmentFail,
  updatedAppointmentSuccess,
  updatedAppointmentFail,
  deletedAppointmentSuccess,
  deletedAppointmentFail,
  appointmentConflict,
  appointmentOutsideBusinessHours,
} from "./appointment.constants";

dayjs.extend(utc);
dayjs.extend(timezone);

const dispatch = (action) => store.dispatch(action);

const { read, create, update, remove, readCalendarList, exportReservations } = {
  read: async (roomId, start, end) => {
    dispatch(setLoading(true));
    try {
      const response = await appointmentRepository.readAllAppointments(
        roomId,
        start,
        end
      );
      const responseSorted = response.sort((a, b) =>
        dayjs(b.createdAt).diff(dayjs(a.createdAt))
      );
      dispatch(readItem({ data: responseSorted, roomId }));
      return responseSorted;
    } catch (error) {
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  },
  create: async (businessId, newAppointmentPayload) => {
    dispatch(setLoading(true));
    try {
      const response = await appointmentRepository.createAppointment(
        businessId,
        newAppointmentPayload
      );

      // se o payload tiver recurrenceType e != 'NONE', sabemos que é recorrência
      const isRecurrence =
        newAppointmentPayload.recurrenceType &&
        newAppointmentPayload.recurrenceType !== "NONE";

      if (!isRecurrence) {
        const actualRoomId = store.getState().appointments.roomId;
        if (response.roomId === actualRoomId) {
          dispatch(addItem(response));
        }
      }

      const { roomId } = newAppointmentPayload;
      const startOfMonth = dayjs().startOf("month").format();
      const endOfMonth = dayjs().endOf("month").format();

      if (roomId) {
        await read(roomId, startOfMonth, endOfMonth);
      }

      // Se chegou até aqui sem erro, agora sim dispara toast de sucesso
      notification(createdAppointmentSuccess);

      return true;
    } catch (error) {
      if (error?.response?.data?.error === "The selected time conflicts ...") {
        notification(appointmentConflict);
      } else {
        notification(createdAppointmentFail);
      }
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  },

  update: async (appointmentId, updateAppointmentPayload, scope = "single", isList = false, updateParams = {}) => {
    dispatch(setLoading(true));
    try {
      const response = await appointmentRepository.updateAppointment(
        appointmentId,
        updateAppointmentPayload,
        scope
      );

      const isSeries = scope === "series";

      if (!isSeries && !isList) {
        const actualRoomId = store.getState().appointments.roomId;
        if (response.roomId === actualRoomId) {
          dispatch(updateItem(response));
        }
      }

      if(isList){
        const response = await readCalendarList(updateParams);
        return response;
      }else{
        const { roomId } = updateAppointmentPayload;
        if (roomId) {
          const startOfWeek = dayjs().startOf("week").format();
          const endOfWeek = dayjs().endOf("week").format();
          await read(roomId, startOfWeek, endOfWeek);
        }
      }

      notification(updatedAppointmentSuccess);

      return true;
    } catch (error) {
      if (
        error?.response?.data?.error ===
        "The selected time conflicts with another schedule"
      ) {
        notification(appointmentConflict);
      } else if (
        error?.response?.data?.error ===
        "The selected time is outside of business hours"
      ) {
        notification(appointmentOutsideBusinessHours);
      } else {
        notification(updatedAppointmentFail);
      }
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  },
  remove: async (appointmentId, scope = "single") => {
    dispatch(setLoading(true));
    try {
      const { result } = await appointmentRepository.deleteAppointment(
        appointmentId,
        scope
      );

      result.forEach((appointment) => {
        dispatch(removeItem({ id: appointment.id }));
      });

      notification(deletedAppointmentSuccess);

      return true;
    } catch (error) {
      console.log("error", error);
      notification(deletedAppointmentFail);
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  },
  readCalendarList: async ({
    businessId,
    page = 1,
    limit = 10,
    order = "asc",
    orderBy = "date",
  }) => {
    try {
      const response = await appointmentRepository.readCalendarList(
        businessId,
        page,
        limit,
        order,
        orderBy
      );
      const { reservations, ...pageData } = response;
      dispatch(readItem({ data: reservations, roomId: null, pageData }));
      return response;
    } catch (error) {
      return false;
    }
  },
  exportReservations: async (businessId, start, end) => {
    try {
      const response = await appointmentRepository.exportReservations(
        businessId,
        start,
        end
      );
      return response;
    } catch (error) {
      return false;
    }
  },
};

const appointmentService = {
  read,
  create,
  update,
  remove,
  readCalendarList,
  exportReservations,
};

export default appointmentService;
