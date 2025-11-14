import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
    id?: string;
    name?: string;
    imageUrl?: string | null; //xd
    username?: string | null; //xd
    navbar?: boolean;

}
export const UserInfo = ({ id, imageUrl, name, username, navbar }: Props) => {

    if (navbar) {
        return (
            <Link href={`/users/${id}`}>
                <div
                    key={id}
                    className="flex items-center gap-3"
                >
                    <div className="relative">
                        <Avatar className="w-12 h-12 border-2 ">
                            <AvatarImage src={imageUrl ?? ""} alt={name || "name"} />
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white font-semibold">
                                {name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate text-sm">
                            {name}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">@{username}</p>
                    </div>
                </div>
            </Link>
        )
    }

    return (
        <Link href={`/users/${id}`}>
            <div
                key={id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all duration-200 group cursor-pointer"
            >
                <div className="relative">
                    <Avatar className="w-12 h-12 border-2 border-white shadow-md group-hover:border-green-200 transition-colors">
                        <AvatarImage src={imageUrl ?? ""} alt={name || "name"} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-teal-600 text-white font-semibold">
                            {name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">
                        {name}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">@{username}</p>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-100"
                >
                </Button>
            </div>
        </Link>
    )
}