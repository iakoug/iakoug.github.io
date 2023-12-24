import React from "react";
import { ByteDance } from "../Bytedance"

import * as styles from "./Page.module.scss";

interface Props {
  title?: string;
  children: React.ReactNode;
}

const byteDance = [
  `"你不知道那究竟有什么意义，开始了就不能重来。"`,
  `"当蝴蝶们逐一金属般爆炸，焚烧，死去而所见之处仅仅遗留你的痕迹。"`,
  `"若隐若现的灯火，周而复始的星辰。"`,
  `"喧闹任其喧闹，自由我自为之。"`,
  `"世界上没有那么多的来日方长，我们应该及时行乐。"`,
  `"从众而活，是一场大规模的囚徒困境。"`,
  `"哲学自杀"：理性阐述往往不得要领，于是利用理性阐述的失败来为信仰荒诞做辩护。`,
  `"Reset! Reset! Reset!"`,
  `"白驹过隙，忽然而已。"`,
  `"圆圈们一再扩散，有风景若鱼儿游弋，你可能是另一个你。"`,
  `"让睁眼看着玫瑰花的人也看看它的刺。"`,
  `"玻璃晴朗，橘子辉煌。"`,
  `"生有热烈，藏与俗常。"`,
  `"愿岁并谢，与长友兮。"`,
  `"万物无邪，人间炽烈。"`,
  `"万事胜意，平安喜乐。"`,
  `"和光同尘。"`,
  `"一切的信仰都带着呻吟。"`,
  `"恭喜发财。"`,
  `"喵桑，故乡的樱花开了 🌸 ₍˄·͈༝·͈˄*₎◞ ̑̑"`,
]

const Page: React.FC<Props> = ({ title, children }: Props) => {
  return (
    <div className={styles.page}>
      <div>
        <ByteDance byteDance={byteDance}></ByteDance>
        {title && <h1>{title}</h1>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Page;
