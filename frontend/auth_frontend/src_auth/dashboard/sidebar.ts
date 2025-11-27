export function renderSidebar(): string {
  return `<div id="layout" class="flex justify-center items-center h-[calc(90vh-3rem)] w-30 ">
      <aside id="sidebar" class="bg-gradient-to-t from-[#711F21] via-[#E63946] to-[#711F21] h-[65%] w-[50%] rounded-3xl">
        <nav class="flex flex-col justify-around h-full items-center">
          <a href="">
            <span class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              home
            </span>
          </a>
          <a href="">
            <span class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              stadia_controller
            </span>
          </a>
          <a href="">
            <span class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              chat
            </span>
          </a>
          <a href="">
            <span class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              rewarded_ads
            </span>
          </a>
          <a href="">
            <span class="material-symbols-outlined 
              transition duration-300 ease-in-out 
              hover:scale-110 text-[#fff] hover:text-[#fff]
              p-2 rounded-full
              hover:shadow-[0_0_10px_#fff,0_0_20px_#FD1D1D,0_0_40px_#711F21]
              hover:bg-[rgba(253,29,29,0.1)]">
              account_circle
            </span>
          </a>
        </nav>
      </aside>
    </div>
`;
}
