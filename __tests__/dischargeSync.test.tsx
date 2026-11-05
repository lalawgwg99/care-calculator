/**
 * 待辦頁 ↔ 報告書首次載入同步（元件層驗證，2026-11-05 實測 bug 修復）。
 *
 * 實測情境：待辦頁把出院日改成 2026-11-20，報告書仍顯示預設 2026-11-12
 * 與舊時程；報告書首次打開待辦顯示未勾選，重新整理後才顯示已勾選。
 * 驗證方式：預先在 localStorage 種入 2026-11-20 的紀錄，渲染後立即就應
 * 看到正確日期與已勾選狀態；且渲染過程不得把已存狀態寫回空值。
 */
import { render, screen } from "@testing-library/react";
import CareReport from "@/components/CareReport";
import DischargeChecklist from "@/components/DischargeChecklist";
import { DISCHARGE_STORAGE_KEY } from "@/lib/dischargePlan";

const SEEDED = {
  dischargeDate: "2026-11-20",
  checked: ["contact-team", "call-1966"],
  docsChecked: ["身分證（長輩本人）"],
};

function seedStorage() {
  window.localStorage.setItem(DISCHARGE_STORAGE_KEY, JSON.stringify(SEEDED));
}

function checkedBoxes() {
  const boxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
  return boxes.filter((b) => b.checked);
}

describe("出院狀態首次載入同步（元件）", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, "", "/tools/care-report");
  });

  it("報告書首次渲染就用已存日期（無參數時）並顯示已勾選", () => {
    seedStorage();
    const { container } = render(<CareReport />);
    // 日期輸入框即為已存的 2026-11-20，不是預設 2026-11-12
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(dateInput.value).toBe("2026-11-20");
    // D-7 待辦已按 11-20 重算為 11/13（兩項同日），不再是預設 11-12 的 11/5
    expect(screen.getAllByText("11月13日（週五）")).toHaveLength(2);
    expect(screen.queryByText("11月5日（週四）")).not.toBeInTheDocument();
    // 勾選狀態首次渲染即正確：2 項待辦＋1 項文件
    expect(screen.getAllByRole("checkbox")).toHaveLength(17);
    expect(checkedBoxes()).toHaveLength(3);
    // 渲染過程不得把已存紀錄寫回空值
    expect(JSON.parse(window.localStorage.getItem(DISCHARGE_STORAGE_KEY)!)).toEqual(SEEDED);
  });

  it("報告書 ?discharge= 參數優先於已存日期", () => {
    seedStorage();
    window.history.pushState({}, "", "/tools/care-report?discharge=2026-11-25");
    const { container } = render(<CareReport />);
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(dateInput.value).toBe("2026-11-25");
    expect(screen.getAllByText("11月18日（週三）")).toHaveLength(2);
  });

  it("待辦頁首次渲染就用已存日期，日期輸入值為 2026-11-20", () => {
    seedStorage();
    const { container } = render(<DischargeChecklist />);
    const dateInput = container.querySelector('input[type="date"]') as HTMLInputElement;
    expect(dateInput.value).toBe("2026-11-20");
    expect(screen.getAllByRole("checkbox")).toHaveLength(17);
    expect(checkedBoxes()).toHaveLength(3);
    // 已存日期在待辦頁渲染後仍保留（未被預設值覆蓋）
    expect(JSON.parse(window.localStorage.getItem(DISCHARGE_STORAGE_KEY)!).dischargeDate).toBe("2026-11-20");
  });
});
