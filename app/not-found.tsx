import Link from "next/link";
import Icon from "@/components/Icon";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-4 flex justify-center text-apple-gray-400"><Icon name="search" size={64} /></div>
        <h1 className="text-[28px] sm:text-[34px] font-bold text-apple-gray-900 mb-3 tracking-tight">
          找不到這個頁面
        </h1>
        <p className="text-[16px] text-apple-gray-500 leading-relaxed mb-8">
          你要找的頁面不存在，可能已移除或網址有誤。
          不用擔心，從下方繼續你的長照規劃。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link
            href="/"
            className="px-7 py-3.5 bg-gradient-to-r from-apple-orange to-apple-pink text-white text-[16px] font-semibold rounded-full shadow-lg shadow-orange-200/50 hover:shadow-xl transition-shadow"
          >
            <Icon name="home" size={20} />回首頁試算
          </Link>
          <Link
            href="/blog"
            className="px-7 py-3.5 bg-apple-gray-50 text-apple-gray-900 text-[16px] font-semibold rounded-full border border-apple-gray-200/60 hover:bg-apple-gray-200 transition-colors"
          >
            <Icon name="book" size={20} />長照知識庫
          </Link>
        </div>

        <a
          href="tel:1966"
          className="inline-flex items-center gap-2 text-[15px] text-apple-orange font-semibold hover:underline underline-offset-2"
        >
          <Icon name="phone" size={17} className="inline-block align-[-3px] mr-1" />有問題？撥打長照專線 1966
        </a>
      </div>
    </div>
  );
}
