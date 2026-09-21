export type BookingRequest = {
  roomId: string
  checkIn: string
  checkOut: string
  guests: string
}

function formString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : ""
}

export function bookingRequestFromFormData(formData: FormData): BookingRequest {
  return {
    roomId: formString(formData.get("roomId")),
    checkIn: formString(formData.get("checkIn")),
    checkOut: formString(formData.get("checkOut")),
    guests: formString(formData.get("guests")),
  }
}
