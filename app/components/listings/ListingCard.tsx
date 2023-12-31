'use client'

import useCointries from "@/app/hooks/useCountries";
import { SafeListing, SafeUser,SafeReservation } from "@/app/types";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {format} from "date-fns"
import Image from"next/image"

import HeartButton from "../HeartButton";
import Button from "../Button";

interface ListingCardProps{
    data: SafeListing;
    reservation?:SafeReservation;
    onAction?:(id:string) => void
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: SafeUser | null
}

const ListingCard:React.FC<ListingCardProps> = (
    {data,
    reservation,
    onAction,
    disabled,
    actionId ="",
    actionLabel,
    currentUser}) => {
        
    const router = useRouter()
    const {getByValue} = useCointries()

    const location = getByValue(data.locationValue)

    const handleCancel =useCallback((e:React.MouseEvent<HTMLButtonElement>)=>{
        e.stopPropagation();
        if(disabled){
            return ;
        }
        onAction?.(actionId)
    },[onAction,actionId,disabled])

/* Khối mã này đang sử dụng hook `useMemo` để tính giá niêm yết. Nếu có một
   đặt trước cho danh sách, nó sẽ trả về `totalprice` của đặt trước. Nếu không, nó
   sẽ trả về `giá` của dữ liệu niêm yết. Móc `useMemo` được sử dụng để ghi nhớ kết quả của
   phép tính này để nó chỉ được tính lại khi các giá trị `reservation` hoặc `data.price`
   thay đổi. */
    const price = useMemo(()=>{
        if(reservation){
            return reservation.totalPrice;
        }
        return data.price;
    },[reservation,data.price])

    const reservationDate= useMemo(()=>{
        if(!reservation){
            return null;
        }
        
        const start =new Date(reservation.startDate)
        const end =new Date(reservation.endDate)

        return `${format(start,'PP')} - ${format(end,'PP')}`
    },[reservation])

    return ( 
    <div 
    onClick={()=> router.push(`/listings/${data.id}`)}
        // group ở đây giúp khi hover vào thằng lớn thì nó sẽ hover lên 110
    className="
    col-span-1 cursor-pointer group
    ">
        <div className="
        flex flex-col gap-2 w-full
        ">
            <div className="
            aspect-square
            w-full
            relative
            overflow-hidden
            rounded-xl
            ">
                <Image 
                fill
                alt="Lsting"
                src={data.imageSrc}
                // group-hover:scale-100 khi hover vao no zoom lên kết hợp đặt group ở trên  
                className="object-cover
                 h-full
                  w-full 
                  group-hover:scale-110 
                  transition"
                />
                <div className="absolute top-3 right-3">
                        <HeartButton
                        listingId={data.id}
                        currentUser={currentUser}
                        />
                </div>
            </div>
            <div className="font-semibold text-lg">
                    {location?.region} , {location?.label}
            </div>
            <div className="font-light text-neutral-500">
                    {reservationDate || data.category}
            </div>
            <div className="flex flex-row items-center gap-1">
                <div className="font-semibold">
                        ${price}
                </div>
                {!reservation &&(
                    <div className="font-light">
                        night
                    </div>
                )}
            </div>
            {onAction && actionLabel &&(
                <Button 
                disabled={disabled}
                small
                label={actionLabel}
                onClick={handleCancel}
                />
            )}
        </div>
    </div> 
    );
}
 
export default ListingCard;