import {useState, useRef, useEffect} from "react";
import SimpleGallery from "@/components/SmpleGallery";
import { useToast } from "@/hooks/use-toast";
import {Progress} from "@/components/ui/progress";
import {get,post} from '@/services/request';
import {Upload} from "lucide-react"
import ExifReader from 'exifreader';
import { format } from 'date-fns';
import {throttle} from '@/utils';

// 生成文件的唯一标识符（例如使用文件名和时间戳）
function generateFileId(file:File) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}
interface uploadedChunksInterface {
    uploadedChunks:[]
}
interface chunkIndexInterface{
    chunkIndex: number,
    totalChunks: number
    file: Blob,
    fileName: string,
    type: string,
    imageHeight: number,
    imageWidth: number,
    lastModified: number,
    fileId: string,
}
interface uploadListInterface {
    file: File,
    fileName: string,
    fileId: string,
    type: string,
    lastModified: number,
    imageHeight: number,
    imageWidth: number,
    fileChunks?:Array<chunkIndexInterface>,
}
interface getAlbumListInterface{
    pageNum: number;
    pageSize: number;
    date: string;
}
// 查询服务器已上传的切片
async function getUploadedChunks(fileId:string) {
    const response = await get<uploadedChunksInterface>(`/files-center/check-upload?fileId=${fileId}`);
    return response.data.uploadedChunks || [];
}

function convertToTimestamp(dateString:string) {
    // 将字符串按格式拆分
    const [datePart, timePart] = dateString?.split(' ') ?? '';
    const [year, month, day] = datePart.split(':');
    const [hours, minutes, seconds] = timePart.split(':');

    // 创建一个 Date 对象
    const date = new Date(
        year,
        month - 1, // 月份从 0 开始，所以减 1
        day,
        hours,
        minutes,
        seconds
    );

    // 返回时间戳
    return date.getTime();
}
const fileHost = 'http://192.168.50.184:3000';
function Home() {
    const { toast } = useToast();
    const [progress, setProgress] = useState<number>(0);
    const [list, setList] = useState<Array<any>>([]);
    const [groupData, setGroupData] = useState({});
    const [pageNum, setPageNum] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(20);
    const [total, setTotal] = useState<number>(0);
    const uploadChunkNum = useRef<any>({});
    const totalWaitNum = useRef<number>(0);
    const currentWaitNum = useRef<number>(0);
    const listAllRef = useRef<any>({});
    const scrollLoad = throttle(async () => {
        const {list: dataList, pageNum: _pageNum, pageSize: _pageSize, total: _total} = listAllRef.current;
        const scrollTop = window.scrollY || window.document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = window.document.documentElement.scrollHeight;
        if ((scrollTop + windowHeight >= documentHeight - 100) && _total > dataList?.length) {
            console.log('滚动');
            setPageNum(_pageNum + 1);
            await getList({pageNum: (_pageNum + 1), pageSize:_pageSize, date: format(new Date(), 'yyyy-MM-dd')},dataList);
        }
    }, 100);
    useEffect(() => {
        window.addEventListener('scroll', scrollLoad);
        return () => {
            window.removeEventListener('scroll', scrollLoad);
        }
    }, []);
    useEffect(() => {
        listAllRef.current = {
            list, pageSize, pageNum, total
        }
    }, [list]);
    const getList = async (param:getAlbumListInterface,dataList:Array<any>) => {
        const res = await get<any>('/user/phone_album', param);
        if(res.success){
            const {data,total} = res?.data;
            let groupData: any = {};
            setTotal(total);
            const _data = data.map((item: any) => {
                let date = format(new Date(parseInt(item?.last_modified)), 'yyyy年MM月dd日');
                item.date = date;
                item.file_path = `${fileHost}${item.file_path}`;
                item.width = item?.image_width;
                item.height = item?.image_height;
                return item;
            });
            const mergeList = [..._data, ...dataList];
            mergeList.forEach(item => {
                groupData[item?.date] = [...groupData?.[item?.date] ?? [], item];
            });
            setGroupData(groupData);
            setList(mergeList);
        }
    }
    const postFile = (formData:any,callback?:any) => {
        post<any>('/files/upload', formData)
            .then(response => {
                if (response.success) {
                    currentWaitNum.current += 1;
                    setProgress(Math.round((currentWaitNum.current / totalWaitNum.current) * 100));
                    if (currentWaitNum.current >= totalWaitNum.current) {
                        toast({
                            description: "文件传输完成",
                            duration: 1000,
                        });
                        currentWaitNum.current = 0;
                        totalWaitNum.current = 0;
                        setTimeout(async () => {
                            setProgress(0);
                            await getList({pageNum: 1, pageSize, date: format(new Date(), 'yyyy-MM-dd')},[]);
                        }, 1000);
                    }
                    if(callback){
                        callback();
                    }
                } else {
                    toast({
                        variant: "destructive",
                        description: "文件传输错误",
                        duration: 1000
                    });
                }
            })
            .catch(error => {
                console.log(error);
                toast({
                    variant: "destructive",
                    description: "文件传输错误",
                    duration: 1000
                });
            });
    }
    const uploadChunkFetch = (fileChunks:Array<chunkIndexInterface>,filename:string) => {
        if (uploadChunkNum.current?.[filename] >= fileChunks.length) {
            uploadChunkNum.current[filename] = 0;
            return;
        }
        if(!uploadChunkNum.current?.[filename]){
            uploadChunkNum.current[filename] = 0;
        }
        const files = fileChunks[uploadChunkNum.current[filename]];
        const formData = new FormData();
        const renamedFile = new File([files?.file], files?.fileName, {type: files?.type});

        formData.append('file', renamedFile);
        formData.append('imageWidth', files?.imageWidth?.toString());
        formData.append('imageHeight', files?.imageHeight?.toString());
        formData.append('lastModified', files?.lastModified?.toString());
        formData.append('chunkIndex', files.chunkIndex?.toString());
        formData.append('totalChunks', files.totalChunks?.toString());
        formData.append('fileName', files?.fileName);
        formData.append('fileId', files?.fileId); // 传递唯一的文件标识符

        postFile(formData, () => {
            uploadChunkNum.current[filename] += 1;
            uploadChunkFetch(fileChunks,fileChunks?.[0]?.fileName);
        });
    }
    const uploadListFetch = (fileData: uploadListInterface) => {
        const formData = new FormData();
        const renamedFile = new File([fileData?.file], fileData?.fileName, {type: fileData?.type});
        formData.append('imageWidth', fileData?.imageWidth?.toString());
        formData.append('imageHeight', fileData?.imageHeight?.toString());
        formData.append('lastModified', fileData?.lastModified?.toString());
        formData.append('file', renamedFile);
        formData.append('fileName', fileData?.fileName);
        formData.append('fileId', fileData?.fileId); // 传递唯一的文件标识符

        postFile(formData);
    };
    const uploadFile = async (files: FileList) => {
        if(!files){
            toast({
                title: "",
                description: "请选择文件",
            });
            return;
        }
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
        let uploadList: Array<uploadListInterface> = [];
        for (let i = 0; i < files.length; i++) {
            const fileId = generateFileId(files[i]);
            const tags = await ExifReader.load(files[i]);
            const imageDate: string = tags?.['DateTimeOriginal']?.description ?? '';
            const lastModified = imageDate ? convertToTimestamp(imageDate) : files[i]?.lastModified;
            if (files[i]?.size > CHUNK_SIZE) {
                const totalChunks = Math.ceil(files[i].size / CHUNK_SIZE);
                let fileChunks: Array<chunkIndexInterface> = [];
                for (let j = 0; j < totalChunks; j++) {
                    const start = j * CHUNK_SIZE;
                    const end = Math.min(start + CHUNK_SIZE, files[i].size);
                    const chunk = files[i].slice(start, end);//文件切片
                    fileChunks.push({
                        file: chunk,
                        fileName: files[i]?.name,
                        fileId,
                        type:files[i]?.type,
                        chunkIndex:j,
                        imageHeight: tags?.['Image Height']?.value ?? 0,
                        imageWidth: tags?.['Image Width']?.value ?? 0,
                        lastModified,
                        totalChunks
                    });
                }
                uploadList.push({
                    fileChunks,
                    file: files[i],
                    imageHeight: tags?.['Image Height']?.value ?? 0,
                    imageWidth: tags?.['Image Width']?.value ?? 0,
                    fileName:files[i]?.name,
                    type:files[i]?.type,
                    lastModified,
                    fileId
                })
            } else {
                uploadList.push({
                    file: files[i],
                    type:files[i]?.type,
                    imageHeight: tags?.['Image Height']?.value ?? 0,
                    imageWidth: tags?.['Image Width']?.value ?? 0,
                    fileName:files[i]?.name,
                    lastModified,
                    fileId
                });
            }
        }
        uploadList.forEach(item => {
            if (item?.fileChunks) {
                totalWaitNum.current += item.fileChunks.length;
                uploadChunkFetch(item.fileChunks,item.fileChunks?.[0]?.fileName);
            } else {
                totalWaitNum.current += 1;
                uploadListFetch(item);
            }
        });
        /*// 获取服务器已上传的切片索引
        const uploadedChunks = await getUploadedChunks(fileId);
        let currentChunk = uploadedChunks.length;
        if (currentChunk > 0) {
            setProgress(Math.round((currentChunk / totalChunks) * 100));
        }*/
    }
    const handlerFileChange =  async () => {
        const fileInput = window.document.getElementById('file') as HTMLInputElement;
        if (fileInput?.files?.length && fileInput?.files?.length > 0) {
            await uploadFile(fileInput?.files);
        }
    }
    return (<>
            <div className="p-2" id="warp">
                {
                    Object.entries(groupData).map((item:any)=> {
                        const [key, value] = item;
                        return <div className="w-full mb-2" key={key}>
                            <h1 className="mb-1">{key}</h1>
                            <div id="my-gallery">
                                <SimpleGallery galleryID="my-gallery" images={value}/>
                            </div>
                        </div>
                    })
                }
            </div>
            <div className="flex justify-center items-center fixed w-14 h-14 right-4 border-solid border border-black bottom-4 bg-inherit rounded-full">
                <Upload size={24}/>
                <input type="file" multiple={true} id="file" onChange={handlerFileChange} className="absolute left-0 right-0 opacity-0 w-full h-full" accept="video/mp4,video/ogg,video/webm,video/mov,image/*"/>
            </div>
            <Progress value={progress} className="absolute bg-white top-0 left-0 h-1 w-full" />
        </>
    );
}

export default Home;
