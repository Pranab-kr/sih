import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-neutral-800">Sustainability Impact Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">Monitor and optimize your environmental footprint</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-neutral-800">Alex Johnson</p>
            {/* <p className="text-xs text-neutral-500">Sustainability Manager</p> */}
          </div>
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            <AvatarFallback className="bg-sky-100 text-sky-700">AJ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}