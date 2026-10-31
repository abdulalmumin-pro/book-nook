import Image from "next/image";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const BooksDetailsPage = async ({ params }: Props) => {
    const { id } = await params;
    
    const res = await fetch (`http://localhost:7000/books/${id}`);
    const book = await res.json();


    return (
        <div>
           <Image src={book.image} alt="bookImg" width={200} height={200}/>
        </div>
    );
};

export default BooksDetailsPage;