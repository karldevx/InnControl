"use client";

import React, { useState } from "react";
import { bookingSchema } from "../schema/schema";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import SubmitButton from "@/components/forms/submit-button";
import { calculateTotalPrice } from "@/lib/utils";
import { api } from "@/app/_trpc/client";
import { toast } from "sonner";

const BookingForm = () => {
  const [totalNights, setTotalNights] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [additionalService, setAdditionalService] = useState<string>("");
  const [bookingType, setBookingType] = useState<string>("");
  const bookingMutation = api.app.createBooking.useMutation();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      room_no: "",
      room_type: "",
      last_name: "",
      first_name: "",
      email: "",
      contact_no: "",
      address: "",
      check_in: new Date(),
      check_out: undefined,
      no_of_nights: "",
      additional_services: undefined,
      booking_type: undefined,
      payment_method: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    const { no_of_nights, room_type, additional_services, booking_type } =
      values;

    const totalNights = parseInt(no_of_nights);
    const { totalAmount, roomPrice } = calculateTotalPrice(
      room_type,
      totalNights,
      additional_services,
      booking_type
    );

    setAdditionalService(additional_services);
    setBookingType(booking_type);
    setTotalNights(totalNights);
    setPrice(roomPrice);
    setTotalAmount(totalAmount);

    console.log(values);
    toast.promise(
      bookingMutation.mutateAsync({
        ...values,
        no_of_nights: totalNights,
        payment_amount: totalAmount,
      }),
      {
        loading: "registering...",
        success: () => {
          return "booked successfully";
        },
        error: (error: unknown) => {
          return (error as Error).message;
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className=" flex flex-col gap-4 ">
          <h1 className="text-xl font-bold py-1.5 border-b border-primary">
            Room Information
          </h1>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="room_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Room Type</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SR - Deluxe">SR - Deluxe</SelectItem>
                      <SelectItem value="SR - Prime">SR - Prime</SelectItem>
                      <SelectItem value="SR - Premier">SR - Premier</SelectItem>
                      <SelectItem value="ER - 1 Bed Room">
                        ER - 1 Bed Room
                      </SelectItem>
                      <SelectItem value="ER - 2 Bed Room">
                        ER - 2 Bed Room
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Room No.</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="x-999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="check_in"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    <span>Check In Date</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"secondary"} className="shadow">
                          {field.value ? (
                            <span>{new Date(field.value).toDateString()}</span>
                          ) : (
                            <span>Check In Date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_out"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    <span>Check Out Date</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"secondary"} className="shadow">
                          {field.value ? (
                            <span>{new Date(field.value).toDateString()}</span>
                          ) : (
                            <span>Check Out Date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="no_of_nights"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>No. of Nights</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="No. of nights" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additional_services"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Service</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select additional service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Breakfast">Breakfast</SelectItem>
                      <SelectItem value="N/A">N/A</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="booking_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Booking Type</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select booking type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Walk-in">Walk-in</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Payment Type</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit-card">Credit Card</SelectItem>
                      <SelectItem value="Others">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col mt-2">
            <div className="flex justify-between text-sm border-b py-1">
              <span className="font-semibold">Total of Nights :</span>
              <span className="font-light">{totalNights}</span>
            </div>

            <div className="flex justify-between text-sm border-b py-1">
              <span className="font-semibold">Room Price :</span>
              <span className="font-light">{price}</span>
            </div>

            {additionalService === "breakfast" && (
              <div className="flex justify-between text-sm border-b py-1">
                <span className="font-semibold">Services fee :</span>
                <span className="font-light">500</span>
              </div>
            )}

            <div className="flex justify-between text-sm border-b py-1">
              <span className="font-semibold">Total Amount :</span>
              <span className="font-bold">{totalAmount}</span>
            </div>

            {bookingType === "online" && (
              <div className="flex justify-between text-sm py-1">
                <span className="font-semibold">Online Book :</span>

                <div className="flex gap-x-1">
                  <span className="text-red-500">5%</span>
                  <span className="font-light">discount</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className=" flex flex-col gap-4">
          <h1 className="text-xl font-bold py-1.5 border-b border-primary">
            Customer Information
          </h1>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Last Name</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>First Name</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Email Address</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span>Contact No.</span>
                    <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="(+63) XXXX-XXX-XXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span>Address</span>
                  <span className="text-red-500 ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Street Address, City, State ZIP"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SubmitButton mutation={bookingMutation}>Submit</SubmitButton>
      </form>
    </Form>
  );
};

export default BookingForm;
