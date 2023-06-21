import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }
  const {listingId} = params;

  if(!listingId || typeof listingId !== "string") {
    throw new Error('Inavalid Id')
  }
 
  /* Đoạn mã này đang tạo một mảng mới gọi là `favoriteIds` bằng cách phân bổ các giá trị của
   `currentUser.favoriteIds` (nếu nó tồn tại) hoặc một mảng trống `[]`. Sau đó, nó được thêm vào
   `listingId` vào cuối mảng `favoriteIds` bằng phương thức `push()`. Đây là một cách để
   cập nhật mảng `favoriteIds` bằng một giá trị mới mà không sửa đổi giá trị ban đầu
   Mảng `currentUser.favoriteIds`. */
  let favoriteIds=[...(currentUser.favoriteIds || [])]
  favoriteIds.push(listingId)

  const user = await prisma.user.update({
    where: {
        id: currentUser.id
    },
    data:{
        favoriteIds
    }
  })
  return NextResponse.json(user)
}
export async function DELETE(request: Request,{params}:{params: IParams}){
const currentUser = await getCurrentUser()

if(!currentUser){
    return NextResponse.error()
}

const {listingId} = params;

if(!listingId || typeof listingId !== "string"){
    throw new Error('Invalid ID')
}

let favoriteIds = [...(currentUser.favoriteIds ||[])]

favoriteIds= favoriteIds.filter((id) => id !== listingId)

const user = await prisma.user.update({
    where: {
        id: currentUser.id
    },
    data: {
        favoriteIds
    }
})
return NextResponse.json(user)
}
