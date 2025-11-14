import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { trpc } from "@/trpc/client";
import { Check, X } from "lucide-react"

interface Props {
    id: string;
    name?: string; 
    imageUrl?: string | null; //xd
    username?: string | null; //xd
    userId: string; //logged user
}

export const UserFriendRequest = ({id,name,imageUrl,username,userId}:Props) => {

    const utils = trpc.useUtils();
    const {isPending, mutate: acceptFriend} = trpc.users.acceptRequest.useMutation({
        onSuccess: () => {
            utils.users.getFriends.invalidate({userId})
            utils.users.getPending.invalidate({userId})
        }
    })

    const {isPending: isPendingRej, mutate:rejectFriend} = trpc.users.rejectRequest.useMutation({
        onSuccess: () => {
            utils.users.getPending.invalidate({userId})
        }
    })

    const handleAddFriend = () => {
        acceptFriend({fromUserId: id})
    }

    const handleRejFriend = () => {
        rejectFriend({fromUserId: id})
    }
    return (
        <div
            key={id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-orange-200 transition-all duration-200"
        >
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarImage src={imageUrl || ""} alt={name} />
                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white text-sm">
                    {name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate text-sm">
                    {name}
                </h3>
                <p className="text-xs text-gray-600 truncate">@{username}</p>
                <p className="text-xs text-gray-500 mt-1">Hace 2 días</p>
            </div>

            <div className="flex gap-1">
                <Button
                    size="sm"
                    className="h-8 bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer"
                    onClick={handleAddFriend}
                    disabled={isPending}
                >
                    <Check className="w-3 h-3"  />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 border-red-200 text-red-600 hover:bg-red-50 hover:cursor-pointer"
                    onClick={handleRejFriend}
                    disabled={isPendingRej}
                >
                    <X className="w-3 h-3" />
                </Button>
            </div>
        </div>
    )
}