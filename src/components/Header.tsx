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
            <p className="text-xs text-neutral-500">Sustainability Manager</p>
          </div>
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" />
            <AvatarFallback className="bg-sky-100 text-sky-700">AJ</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}