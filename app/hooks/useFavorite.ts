import axios from "axios";  
import { useRouter } from "next/navigation";
import {useCallback , useMemo} from "react"
import { toast } from "react-hot-toast";

import{SafeUser} from"../types"

import useLoginModal from"./useLoginModal"

interface IUseFavorite{
    listingId: string;
    currentUser?: SafeUser | null;
}

const useFavorite = ({listingId,currentUser}:IUseFavorite)=>{
    const router = useRouter()
    const loginModal = useLoginModal()

    /* `const hasFavorited` là một giá trị boolean cho biết liệu người dùng hiện tại có yêu thích một
     liệt kê cụ thể. Nó được tính toán bằng móc `useMemo`, ghi nhớ kết quả của
     hàm được truyền làm đối số đầu tiên. Hàm kiểm tra xem đối tượng `currentUser` có
     thuộc tính `favoriteIds` và nếu có, nó sẽ kiểm tra xem `listingId` có được bao gồm trong mảng hay không.
     Móc `useMemo` cũng lấy một mảng phụ thuộc làm đối số thứ hai, bao gồm
     `currentUser` và `listingId`. Điều này đảm bảo rằng chức năng chỉ được thực hiện lại nếu một trong hai
     những giá trị này thay đổi. */
    const hasFavorited = useMemo(()=>{
        const list = currentUser?.favoriteIds || []

        return list.includes(listingId)
    },[currentUser, listingId])

    const toggleFavorite = useCallback(async (e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation();

        if(!currentUser){
            return loginModal.onOpen();
        }

        try {
            let request;
            
            if(hasFavorited){
                request = () => axios.delete(`/api/favorites/${listingId}`)
            }else{
                request = () => axios.post(`/api/favorites/${listingId}`)
            }
            await request()
            router.refresh()
            toast.success("Success");
        }catch(error){
            toast.error("Something went wrong!")
        }
        },[currentUser , hasFavorited ,listingId , router , loginModal])

        return {hasFavorited,toggleFavorite}
}
export default useFavorite;