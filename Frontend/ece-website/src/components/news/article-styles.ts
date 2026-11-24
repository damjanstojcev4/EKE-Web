// Exact shared presentation for the live related list and the standalone sidebar.
export const sidebar =
  "pt-[calc(260*var(--u))] min-w-0 [@media(max-width:768px)]:pt-0 [@media(max-width:768px)]:w-full";
export const sidebarCard =
  "relative pb-[calc(36*var(--u))] mb-[calc(40*var(--u))] after:content-[''] after:absolute after:bottom-0 after:left-[45%] after:w-[55%] after:h-px after:bg-[#ddd] [@media(max-width:768px)]:pb-[25px] [@media(max-width:768px)]:mb-[30px]";
export const cardImage =
  "block relative [&_.original-arrow]:[transform:scale(.75)]";
export const cardPicture =
  "w-full h-[calc(188*var(--u))] object-cover rounded-t-[calc(24*var(--u))] [@media(max-width:768px)]:h-auto [@media(max-width:768px)]:aspect-[427/188] [@media(max-width:768px)]:rounded-t-[18px]";
export const sidebarSummary =
  "text-[length:calc(18*var(--u))] leading-[calc(26*var(--u))] mt-[calc(14*var(--u))]! [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden [@media(min-width:769px)_and_(max-width:1100px)]:text-[14px] [@media(min-width:769px)_and_(max-width:1100px)]:leading-[1.4] [@media(max-width:768px)]:text-[16px] [@media(max-width:768px)]:leading-[1.5] [@media(max-width:768px)]:mt-[14px]!";
