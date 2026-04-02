'use client'
/**
 * 📁 src/app/admin/content/page.tsx
 * แก้ไขเนื้อหาทุกหน้าแบบละเอียด — บันทึกลง MongoDB → แสดงบนเว็บทันที
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Leaf, LogOut, Save, ChevronDown, ChevronRight,
  FileText, Loader2, CheckCircle, Plus, Trash2, GripVertical
} from 'lucide-react'

// ── reusable field components ──
const inputCls = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 transition-all'
const textareaCls = 'w-full px-4 py-3 border border-gray-200 rounded-xl font-display text-sm focus:outline-none focus:border-herb-green-400 focus:ring-2 focus:ring-herb-green-100 resize-y transition-all'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-display font-semibold text-gray-700 text-sm mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

// ── Page editors ──

function AboutEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v })
  const paras: string[]  = data.paragraphs || ['', '', '']
  const stats = data.stats || []
  const timeline = data.timeline || []
  const certs = data.certifications || []

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-xl px-4 py-3 text-blue-700 font-display text-sm">
        🔵 <strong>Hero Banner</strong> — แสดงด้านบนสุดของหน้า
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="หัวข้อหลัก Hero"><input className={inputCls} value={data.heroTitle||''} onChange={e=>set('heroTitle',e.target.value)} placeholder="30 ปีแห่ง" /></Field>
        <Field label="ข้อความ Highlight (สีทอง)"><input className={inputCls} value={data.heroHighlight||''} onChange={e=>set('heroHighlight',e.target.value)} placeholder="ภูมิปัญญาไทย" /></Field>
      </div>
      <Field label="คำอธิบาย Hero"><textarea className={textareaCls} rows={2} value={data.heroDesc||''} onChange={e=>set('heroDesc',e.target.value)} placeholder="คำอธิบายสั้นๆ..." /></Field>

      <hr className="border-gray-100" />
      <div className="bg-green-50 rounded-xl px-4 py-3 text-green-700 font-display text-sm">
        🟢 <strong>เนื้อหาหลัก</strong> — ส่วนที่แสดงด้านล่าง Hero
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="หัวข้อเนื้อหา"><input className={inputCls} value={data.storyHeadline||''} onChange={e=>set('storyHeadline',e.target.value)} placeholder="จากรากเหง้า" /></Field>
        <Field label="หัวข้อรอง (สีเขียว)"><input className={inputCls} value={data.storySubheadline||''} onChange={e=>set('storySubheadline',e.target.value)} placeholder="สู่ระดับโลก" /></Field>
      </div>
      {[0,1,2].map(i=>(
        <Field key={i} label={`ย่อหน้าที่ ${i+1}`}>
          <textarea className={textareaCls} rows={3} value={paras[i]||''} onChange={e=>{const p=[...paras]; p[i]=e.target.value; set('paragraphs',p)}} placeholder={`เนื้อหาย่อหน้าที่ ${i+1}...`} />
        </Field>
      ))}

      <hr className="border-gray-100" />
      <div className="bg-purple-50 rounded-xl px-4 py-3 text-purple-700 font-display text-sm">
        🟣 <strong>สถิติ</strong> — กล่องตัวเลขด้านขวา เช่น 30+ ปี, 50+ ประเทศ
      </div>
      {stats.map((s: any, i: number) => (
        <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
          <span className="w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">{i+1}</span>
          <div className="grid grid-cols-3 gap-3 flex-1">
            <Field label="ตัวเลข"><input className={inputCls} value={s.val||''} onChange={e=>{const a=[...stats];a[i]={...a[i],val:e.target.value};set('stats',a)}} placeholder="30+" /></Field>
            <Field label="คำอธิบาย"><input className={inputCls} value={s.label||''} onChange={e=>{const a=[...stats];a[i]={...a[i],label:e.target.value};set('stats',a)}} placeholder="ปีแห่งประสบการณ์" /></Field>
            <Field label="Emoji"><input className={inputCls} value={s.icon||''} onChange={e=>{const a=[...stats];a[i]={...a[i],icon:e.target.value};set('stats',a)}} placeholder="📅" /></Field>
          </div>
          <button onClick={()=>set('stats',stats.filter((_:any,j:number)=>j!==i))} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center mt-5 flex-shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
        </div>
      ))}
      <button onClick={()=>set('stats',[...stats,{val:'',label:'',icon:''}])} className="flex items-center gap-1.5 text-purple-600 font-display font-semibold text-sm hover:text-purple-700">
        <Plus className="w-4 h-4"/>เพิ่มสถิติ
      </button>

      <hr className="border-gray-100" />
      <div className="bg-amber-50 rounded-xl px-4 py-3 text-amber-700 font-display text-sm">
        🟡 <strong>Timeline</strong> — เส้นเวลาประวัติบริษัท
      </div>
      {timeline.map((t: any, i: number) => (
        <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
          <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">{i+1}</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            <Field label="ปี (พ.ศ.)"><input className={inputCls} value={t.year||''} onChange={e=>{const a=[...timeline];a[i]={...a[i],year:e.target.value};set('timeline',a)}} placeholder="2537" /></Field>
            <Field label="ชื่อเหตุการณ์"><input className={inputCls} value={t.title||''} onChange={e=>{const a=[...timeline];a[i]={...a[i],title:e.target.value};set('timeline',a)}} placeholder="ก่อตั้งบริษัท" /></Field>
            <Field label="รายละเอียด"><input className={inputCls} value={t.desc||''} onChange={e=>{const a=[...timeline];a[i]={...a[i],desc:e.target.value};set('timeline',a)}} placeholder="เริ่มผลิต..." /></Field>
          </div>
          <button onClick={()=>set('timeline',timeline.filter((_:any,j:number)=>j!==i))} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center mt-5 flex-shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
        </div>
      ))}
      <button onClick={()=>set('timeline',[...timeline,{year:'',title:'',desc:''}])} className="flex items-center gap-1.5 text-amber-600 font-display font-semibold text-sm hover:text-amber-700">
        <Plus className="w-4 h-4"/>เพิ่มเหตุการณ์
      </button>

      <hr className="border-gray-100" />
      <div className="bg-green-50 rounded-xl px-4 py-3 text-green-700 font-display text-sm">
        🟢 <strong>ใบรับรอง</strong> — GMP, HALAL, อย. ฯลฯ
      </div>
      <div className="flex flex-wrap gap-2">
        {certs.map((c: string, i: number) => (
          <div key={i} className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl pl-3 pr-1 py-1">
            <input className="font-display text-sm border-none outline-none bg-transparent w-24" value={c} onChange={e=>{const a=[...certs];a[i]=e.target.value;set('certifications',a)}} />
            <button onClick={()=>set('certifications',certs.filter((_:any,j:number)=>j!==i))} className="w-5 h-5 text-red-400 hover:text-red-600 flex items-center justify-center"><Trash2 className="w-3 h-3"/></button>
          </div>
        ))}
        <button onClick={()=>set('certifications',[...certs,''])} className="flex items-center gap-1 border-2 border-dashed border-gray-300 hover:border-herb-green-400 text-gray-400 hover:text-herb-green-600 rounded-xl px-3 py-1 font-display text-sm transition-colors">
          <Plus className="w-3.5 h-3.5"/>เพิ่ม
        </button>
      </div>
    </div>
  )
}

function VisionEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v })
  const missions: string[] = data.missionItems || []
  const values = data.values || []

  return (
    <div className="space-y-6">
      <Field label="หัวข้อ Hero"><input className={inputCls} value={data.heroTitle||''} onChange={e=>set('heroTitle',e.target.value)} placeholder="วิสัยทัศน์" /></Field>

      <hr className="border-gray-100" />
      <div className="bg-blue-50 rounded-xl px-4 py-3 text-blue-700 font-display text-sm">🔵 <strong>วิสัยทัศน์</strong></div>
      <Field label="ข้อความวิสัยทัศน์หลัก (ในกรอบกลาง)">
        <textarea className={textareaCls} rows={3} value={data.visionStatement||''} onChange={e=>set('visionStatement',e.target.value)} placeholder="มุ่งมั่นเป็น Thai Herb Brand ระดับโลก..." />
      </Field>
      <Field label="คำอธิบายเพิ่มเติม">
        <textarea className={textareaCls} rows={2} value={data.visionDesc||''} onChange={e=>set('visionDesc',e.target.value)} placeholder="เราเชื่อว่า..." />
      </Field>

      <hr className="border-gray-100" />
      <div className="bg-amber-50 rounded-xl px-4 py-3 text-amber-700 font-display text-sm">🟡 <strong>พันธกิจ</strong></div>
      {missions.map((m: string, i: number) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="w-6 h-6 bg-herb-green-100 text-herb-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
          <input className={inputCls} value={m} onChange={e=>{const a=[...missions];a[i]=e.target.value;set('missionItems',a)}} placeholder="พัฒนาผลิตภัณฑ์..." />
          <button onClick={()=>set('missionItems',missions.filter((_:any,j:number)=>j!==i))} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center flex-shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
        </div>
      ))}
      <button onClick={()=>set('missionItems',[...missions,''])} className="flex items-center gap-1.5 text-herb-green-700 font-display font-semibold text-sm"><Plus className="w-4 h-4"/>เพิ่มพันธกิจ</button>

      <hr className="border-gray-100" />
      <div className="bg-purple-50 rounded-xl px-4 py-3 text-purple-700 font-display text-sm">🟣 <strong>ค่านิยมองค์กร</strong></div>
      {values.map((v: any, i: number) => (
        <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            <Field label="Emoji"><input className={inputCls} value={v.icon||''} onChange={e=>{const a=[...values];a[i]={...a[i],icon:e.target.value};set('values',a)}} placeholder="🌿" /></Field>
            <Field label="ชื่อค่านิยม"><input className={inputCls} value={v.title||''} onChange={e=>{const a=[...values];a[i]={...a[i],title:e.target.value};set('values',a)}} placeholder="ธรรมชาติ" /></Field>
            <Field label="คำอธิบาย"><input className={inputCls} value={v.desc||''} onChange={e=>{const a=[...values];a[i]={...a[i],desc:e.target.value};set('values',a)}} placeholder="ใช้สมุนไพร 100%..." /></Field>
          </div>
          <button onClick={()=>set('values',values.filter((_:any,j:number)=>j!==i))} className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center mt-5 flex-shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
        </div>
      ))}
      <button onClick={()=>set('values',[...values,{icon:'',title:'',desc:''}])} className="flex items-center gap-1.5 text-purple-600 font-display font-semibold text-sm"><Plus className="w-4 h-4"/>เพิ่มค่านิยม</button>
    </div>
  )
}

function AwardsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const set = (k: string, v: any) => onChange({ ...data, [k]: v })
  const awards = data.awards || []
  const certs = data.certifications || []

  return (
    <div className="space-y-6">
      <Field label="หัวข้อ Hero"><input className={inputCls} value={data.heroTitle||''} onChange={e=>set('heroTitle',e.target.value)} placeholder="รางวัล & การรับรอง" /></Field>
      <Field label="คำนำ (แสดงด้านบน)"><textarea className={textareaCls} rows={2} value={data.intro||''} onChange={e=>set('intro',e.target.value)} placeholder="ความสำเร็จที่เป็นเครื่องยืนยัน..." /></Field>

      <hr className="border-gray-100" />
      <div className="bg-amber-50 rounded-xl px-4 py-3 text-amber-700 font-display text-sm">🏆 <strong>รายการรางวัล</strong></div>
      {awards.map((a: any, i: number) => (
        <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-gray-600 text-sm">รางวัลที่ {i+1}</span>
            <button onClick={()=>set('awards',awards.filter((_:any,j:number)=>j!==i))} className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center"><Trash2 className="w-3.5 h-3.5"/></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Emoji"><input className={inputCls} value={a.icon||''} onChange={e=>{const arr=[...awards];arr[i]={...arr[i],icon:e.target.value};set('awards',arr)}} placeholder="🏆" /></Field>
            <Field label="ปี"><input className={inputCls} value={a.year||''} onChange={e=>{const arr=[...awards];arr[i]={...arr[i],year:e.target.value};set('awards',arr)}} placeholder="2566" /></Field>
            <Field label="ชื่อรางวัล"><input className={inputCls} value={a.title||''} onChange={e=>{const arr=[...awards];arr[i]={...arr[i],title:e.target.value};set('awards',arr)}} placeholder="รางวัล OTOP..." /></Field>
            <Field label="หน่วยงาน"><input className={inputCls} value={a.org||''} onChange={e=>{const arr=[...awards];arr[i]={...arr[i],org:e.target.value};set('awards',arr)}} placeholder="กรมพัฒนาชุมชน" /></Field>
          </div>
          <Field label="รายละเอียด">
            <textarea className={textareaCls} rows={2} value={a.desc||''} onChange={e=>{const arr=[...awards];arr[i]={...arr[i],desc:e.target.value};set('awards',arr)}} placeholder="รายละเอียด..." />
          </Field>
        </div>
      ))}
      <button onClick={()=>set('awards',[...awards,{icon:'🏆',title:'',year:'',org:'',desc:''}])} className="flex items-center gap-1.5 text-amber-600 font-display font-semibold text-sm"><Plus className="w-4 h-4"/>เพิ่มรางวัล</button>

      <hr className="border-gray-100" />
      <div className="bg-green-50 rounded-xl px-4 py-3 text-green-700 font-display text-sm">✅ <strong>มาตรฐานที่ได้รับ</strong></div>
      <div className="flex flex-wrap gap-2">
        {certs.map((c: string, i: number) => (
          <div key={i} className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl pl-3 pr-1 py-1">
            <input className="font-display text-sm border-none outline-none bg-transparent w-24" value={c} onChange={e=>{const a=[...certs];a[i]=e.target.value;set('certifications',a)}} />
            <button onClick={()=>set('certifications',certs.filter((_:any,j:number)=>j!==i))} className="w-5 h-5 text-red-400 flex items-center justify-center"><Trash2 className="w-3 h-3"/></button>
          </div>
        ))}
        <button onClick={()=>set('certifications',[...certs,''])} className="border-2 border-dashed border-gray-300 hover:border-herb-green-400 text-gray-400 hover:text-herb-green-600 rounded-xl px-3 py-1 font-display text-sm transition-colors flex items-center gap-1"><Plus className="w-3.5 h-3.5"/>เพิ่ม</button>
      </div>
    </div>
  )
}

function NewsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const items = data.items || []
  const set = (v: any) => onChange({ ...data, items: v })

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 rounded-xl px-4 py-3 text-blue-700 font-display text-sm">
        📰 แต่ละข่าวจะแสดงในหน้า /news — ติ๊ก <strong>ข่าวเด่น</strong> เพื่อให้แสดงใหญ่ด้านบน (ได้แค่ 1 ชิ้น)
      </div>
      {items.map((n: any, i: number) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-gray-700 text-sm">ข่าวที่ {i+1}</span>
            <button onClick={()=>set(items.filter((_:any,j:number)=>j!==i))} className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center"><Trash2 className="w-3.5 h-3.5"/></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="Emoji"><input className={inputCls} value={n.emoji||''} onChange={e=>{const a=[...items];a[i]={...a[i],emoji:e.target.value};set(a)}} placeholder="📢" /></Field>
            <Field label="หมวดหมู่"><input className={inputCls} value={n.category||''} onChange={e=>{const a=[...items];a[i]={...a[i],category:e.target.value};set(a)}} placeholder="ประกาศสำคัญ" /></Field>
            <Field label="วันที่"><input className={inputCls} value={n.date||''} onChange={e=>{const a=[...items];a[i]={...a[i],date:e.target.value};set(a)}} placeholder="15 มีนาคม 2567" /></Field>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!n.featured} onChange={e=>{const a=[...items];a[i]={...a[i],featured:e.target.checked};set(a)}} className="w-4 h-4 accent-herb-green-700" />
                <span className="font-display font-semibold text-herb-green-700 text-sm">⭐ ข่าวเด่น</span>
              </label>
            </div>
          </div>
          <Field label="หัวข้อข่าว *"><input className={inputCls} value={n.title||''} onChange={e=>{const a=[...items];a[i]={...a[i],title:e.target.value};set(a)}} placeholder="หัวข้อข่าว..." /></Field>
          <Field label="สรุปข่าว *"><textarea className={textareaCls} rows={2} value={n.excerpt||''} onChange={e=>{const a=[...items];a[i]={...a[i],excerpt:e.target.value};set(a)}} placeholder="สรุปเนื้อหาข่าว..." /></Field>
        </div>
      ))}
      <button onClick={()=>set([...items,{emoji:'📰',title:'',excerpt:'',date:'',category:'ข่าวสาร',featured:false}])}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-herb-green-300 hover:border-herb-green-500 text-herb-green-600 font-display font-semibold py-3 rounded-xl transition-all">
        <Plus className="w-5 h-5"/>เพิ่มข่าวใหม่
      </button>
    </div>
  )
}

function BlogEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  const items = data.items || []
  const set = (v: any) => onChange({ ...data, items: v })

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 rounded-xl px-4 py-3 text-purple-700 font-display text-sm">
        📖 แต่ละบทความแสดงในหน้า /blog — ติ๊ก <strong>บทความแนะนำ</strong> เพื่อแสดงใหญ่ด้านบน
      </div>
      {items.map((b: any, i: number) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-gray-700 text-sm">บทความที่ {i+1}</span>
            <button onClick={()=>set(items.filter((_:any,j:number)=>j!==i))} className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-400 rounded-lg flex items-center justify-center"><Trash2 className="w-3.5 h-3.5"/></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Field label="Emoji"><input className={inputCls} value={b.emoji||''} onChange={e=>{const a=[...items];a[i]={...a[i],emoji:e.target.value};set(a)}} placeholder="📖" /></Field>
            <Field label="หมวด"><input className={inputCls} value={b.category||''} onChange={e=>{const a=[...items];a[i]={...a[i],category:e.target.value};set(a)}} placeholder="สุขภาพ" /></Field>
            <Field label="วันที่"><input className={inputCls} value={b.date||''} onChange={e=>{const a=[...items];a[i]={...a[i],date:e.target.value};set(a)}} placeholder="20 มีนาคม 2567" /></Field>
            <Field label="เวลาอ่าน"><input className={inputCls} value={b.readTime||''} onChange={e=>{const a=[...items];a[i]={...a[i],readTime:e.target.value};set(a)}} placeholder="5 นาที" /></Field>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!b.featured} onChange={e=>{const a=[...items];a[i]={...a[i],featured:e.target.checked};set(a)}} className="w-4 h-4 accent-purple-600" />
                <span className="font-display font-semibold text-purple-600 text-sm">⭐ แนะนำ</span>
              </label>
            </div>
          </div>
          <Field label="ชื่อบทความ *"><input className={inputCls} value={b.title||''} onChange={e=>{const a=[...items];a[i]={...a[i],title:e.target.value};set(a)}} placeholder="ชื่อบทความ..." /></Field>
          <Field label="สรุปบทความ"><textarea className={textareaCls} rows={2} value={b.excerpt||''} onChange={e=>{const a=[...items];a[i]={...a[i],excerpt:e.target.value};set(a)}} placeholder="สรุปเนื้อหา..." /></Field>
          <Field label="เนื้อหาเต็ม (optional)"><textarea className={textareaCls} rows={4} value={b.content||''} onChange={e=>{const a=[...items];a[i]={...a[i],content:e.target.value};set(a)}} placeholder="เนื้อหาบทความแบบเต็ม..." /></Field>
        </div>
      ))}
      <button onClick={()=>set([...items,{emoji:'📖',title:'',excerpt:'',content:'',date:'',category:'',readTime:'',featured:false}])}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-purple-300 hover:border-purple-500 text-purple-600 font-display font-semibold py-3 rounded-xl transition-all">
        <Plus className="w-5 h-5"/>เพิ่มบทความใหม่
      </button>
    </div>
  )
}

// ── Page Config ──
interface PageDef {
  slug: string; title: string; emoji: string; color: string
  Editor: React.FC<{ data: any; onChange: (d: any) => void }>
}

const PAGES: PageDef[] = [
  { slug: 'about',   title: 'ความเป็นมา',          emoji: '🌿', color: 'text-herb-green-700', Editor: AboutEditor },
  { slug: 'vision',  title: 'วิสัยทัศน์',           emoji: '🎯', color: 'text-blue-600',       Editor: VisionEditor },
  { slug: 'awards',  title: 'รางวัลและการรับรอง',  emoji: '🏆', color: 'text-amber-600',      Editor: AwardsEditor },
  { slug: 'news',    title: 'ข่าวสาร',              emoji: '📰', color: 'text-red-600',        Editor: NewsEditor },
  { slug: 'blog',    title: 'บทความ',               emoji: '📖', color: 'text-purple-600',     Editor: BlogEditor },
]

function PageCard({ page, adminSecret }: { page: PageDef; adminSecret: string }) {
  const [open, setOpen]     = useState(false)
  const [data, setData]     = useState<any>({})
  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    if (!open || loaded) return
    fetch(`/api/page-content/${page.slug}`)
      .then(r => r.json())
      .then(d => { setData(d.found ? (d.content || {}) : {}); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [open, loaded, page.slug])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/page-content/${page.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': adminSecret },
        body: JSON.stringify({ title: page.title, content: data }),
      })
      const d = await res.json()
      if (d.success) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
      else alert('บันทึกไม่สำเร็จ: ' + d.message)
    } catch { alert('เกิดข้อผิดพลาด') } finally { setSaving(false) }
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${open ? 'border-herb-green-200 shadow-md' : 'border-gray-100'}`}>
      <button onClick={() => setOpen(v => !v)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{page.emoji}</span>
          <div>
            <p className={`font-display font-extrabold text-lg ${page.color}`}>{page.title}</p>
            <p className="font-display text-gray-400 text-xs">/{page.slug} — คลิกเพื่อแก้ไข</p>
          </div>
        </div>
        {open ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 pb-6">
          <div className="pt-5">
            {!loaded ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-herb-green-600 animate-spin" /></div>
            ) : (
              <>
                <page.Editor data={data} onChange={setData} />
                <button onClick={save} disabled={saving}
                  className={`w-full mt-6 flex items-center justify-center gap-2 font-display font-bold py-3.5 rounded-xl transition-all ${
                    saved ? 'bg-herb-green-100 text-herb-green-700' : 'bg-herb-green-700 hover:bg-herb-green-800 text-white'
                  }`}>
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />กำลังบันทึก...</>
                    : saved ? <><CheckCircle className="w-4 h-4" />บันทึกสำเร็จแล้ว!</>
                    : <><Save className="w-4 h-4" />บันทึก</>}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main ──
export default function AdminContentPage() {
  const router = useRouter()
  const [adminSecret, setAdminSecret] = useState('')

  useEffect(() => {
    const s = sessionStorage.getItem('adminSecret')
    if (!s) { router.push('/admin'); return }
    setAdminSecret(s)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-herb-green-700 rounded-full flex items-center justify-center"><Leaf className="text-white w-3.5 h-3.5" /></div>
            <Link href="/admin/products" className="font-display text-gray-500 text-sm hover:text-herb-green-700">Admin</Link>
            <span className="text-gray-300">/</span>
            <span className="font-display text-herb-green-700 text-sm font-bold">แก้ไขเนื้อหา</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/products" className="font-display text-sm text-gray-500 hover:text-herb-green-700">📦 สินค้า</Link>
            <Link href="/admin/orders"   className="font-display text-sm text-gray-500 hover:text-herb-green-700">🛒 ออเดอร์</Link>
            <Link href="/admin/slides"   className="font-display text-sm text-gray-500 hover:text-herb-green-700">🖼️ สไลด์</Link>
            <button onClick={() => { sessionStorage.removeItem('adminSecret'); router.push('/admin') }} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 font-display text-xs">
              <LogOut className="w-3.5 h-3.5" />ออก
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-herb-green-700" />
          <h1 className="font-display font-extrabold text-2xl text-herb-dark">แก้ไขเนื้อหาหน้าต่างๆ</h1>
        </div>
        <div className="bg-herb-green-50 border border-herb-green-100 rounded-xl px-4 py-3 mb-6">
          <p className="font-display text-herb-green-800 text-sm">
            💡 คลิกชื่อหน้าเพื่อขยาย → แก้ไขข้อมูล → กด <strong>บันทึก</strong><br/>
            เนื้อหาจะแสดงบนเว็บไซต์ทันที หน้าที่ยังไม่มีข้อมูลจะแสดงเป็นหน้าว่าง
          </p>
        </div>

        <div className="space-y-3">
          {adminSecret && PAGES.map(p => <PageCard key={p.slug} page={p} adminSecret={adminSecret} />)}
        </div>
      </div>
    </div>
  )
}
