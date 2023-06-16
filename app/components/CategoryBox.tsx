'use client'

import { IconType } from "react-icons";
import {useRouter, useSearchParams} from 'next/navigation'
import { useCallback } from "react";
import qs from "query-string"

interface CategoryBoxProps{
    icon: IconType;
    label: string;
    selected?: boolean;
}

const CategoryBox:React.FC<CategoryBoxProps> = ({icon : Icon,label,selected}) => {
    const router = useRouter();
    const params = useSearchParams()

    const handleClick = useCallback(()=>{
        let currentQuery= {};

       /* Mã này đang kiểm tra xem có bất kỳ tham số tìm kiếm nào trong URL hay không bằng cách sử dụng
        Móc `useSearchParams` từ gói `next/navigation`. Nếu có các tham số tìm kiếm, nó
        chuyển đổi chúng thành một đối tượng bằng cách sử dụng phương thức `qs.parse` từ gói `query-string` và
        gán chúng cho biến `currentQuery`. */
        if(params){
            currentQuery = qs.parse(params.toString())
        }

        const updateQuery: any = {
            ...currentQuery,
            category: label
        }

        /* Khối mã này đang kiểm tra xem URL hiện tại đã có tham số truy vấn với khóa chưa
         "category" và giá trị của nó bằng với chỗ dựa nhãn được truyền cho thành phần CategoryBox. Nếu như
         đó là sự thật, nó xóa khóa "danh mục" khỏi đối tượng updateQuery để xóa bộ lọc. */
        if(params?.get('category') === label){
            delete updateQuery.category;
        }

       /* `const url = qs.stringifyUrl({url:'/', query: updateQuery},{skipNull: true});` đang tạo một
        Chuỗi URL với các tham số truy vấn được cập nhật. Nó sử dụng `stringifyUrl` của gói `qs`
        để chuyển đổi đối tượng `updateQuery` thành một chuỗi URL có URL cơ sở là `'/'`. Các
        Tùy chọn `skipNull` được đặt thành `true` để bỏ qua bất kỳ tham số truy vấn nào có giá trị `null` hoặc
        `không xác định`. Chuỗi URL kết quả sau đó được gán cho hằng số `url`.*/
        const url = qs.stringifyUrl({
            url:'/',
            query: updateQuery
        },{skipNull: true});

        router.push(url)
    },[label ,params,router])
    return ( 
    <div
    onClick={handleClick}
    className={`flex 
    flex-col
    items-center
    justify-center
    gap-2
    p-3
    border-b-2
    hover:text-neutral-800
    transition
    cursor-pointer
    ${selected ? 'border-b-neutral-800' : 'border-transparent'}
    ${selected ? 'text-neutral-800' : 'text-neutral-500'}
    `}
    >
        <Icon size={26} />
        <div className="font-medium text-sm">
        {label}
        </div>
    </div> 
    );
}
 
export default CategoryBox;