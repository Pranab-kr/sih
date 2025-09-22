import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-neutral-800">Sustainability Impact Dashboard</h1>
          {/* <p className</div>="text-sm text-neutral-600 mt-1">Monitor and optimize your environmental foo@tprint</p> */}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-neutral-800">User</p>
            {/* <p className="text-xs text-neutral-500">Sustainability Manager</p> */}
          </div>
          <Avatar>
            <AvatarImage src="#" />
            <AvatarFallback className="bg-sky-100 text-sky-700">AJ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}