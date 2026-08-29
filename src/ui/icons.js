/**
 * Peta ikon Kainest — SATU-SATUNYA sumber ikon aplikasi.
 *
 * Set: Material Symbols (Google), di-compile jadi komponen SVG saat build oleh
 * unplugin-icons. Tree-shaken, tanpa request jaringan, tanpa runtime.
 *
 * Halaman WAJIB mengimpor dari sini:      import { IconWallet } from '@/ui/icons'
 * Halaman DILARANG mengimpor langsung:    import ... from '@heroicons/vue/...'
 * (dijaga oleh aturan lint `no-direct-icon-import`)
 *
 * Nama ekspor menggambarkan MAKNA di Kainest, bukan nama ikon di pustakanya —
 * sehingga mengganti set ikon di kemudian hari cukup mengubah berkas ini saja.
 */

/* ── Navigasi & arah ─────────────────────────────────────────── */
export { default as IconArrowUp }      from '~icons/material-symbols/arrow-upward'
export { default as IconArrowDown }    from '~icons/material-symbols/arrow-downward'
export { default as IconArrowLeft }    from '~icons/material-symbols/arrow-back'
export { default as IconArrowRight }   from '~icons/material-symbols/arrow-forward'
export { default as IconChevronDown }  from '~icons/material-symbols/keyboard-arrow-down'
export { default as IconChevronLeft }  from '~icons/material-symbols/chevron-left'
export { default as IconChevronRight } from '~icons/material-symbols/chevron-right'
export { default as IconExternal }     from '~icons/material-symbols/open-in-new'
export { default as IconMenu }         from '~icons/material-symbols/menu'
export { default as IconMore }         from '~icons/material-symbols/more-horiz'
export { default as IconHome }         from '~icons/material-symbols/home-outline'

/* ── Aksi ────────────────────────────────────────────────────── */
export { default as IconAdd }        from '~icons/material-symbols/add'
export { default as IconAddCircle }  from '~icons/material-symbols/add-circle-outline'
export { default as IconClose }      from '~icons/material-symbols/close'
export { default as IconCancel }     from '~icons/material-symbols/cancel-outline'
export { default as IconCheck }      from '~icons/material-symbols/check'
export { default as IconCheckCircle} from '~icons/material-symbols/check-circle-outline'
export { default as IconEdit }       from '~icons/material-symbols/edit-outline'
export { default as IconDelete }     from '~icons/material-symbols/delete-outline'
export { default as IconRefresh }    from '~icons/material-symbols/refresh'
export { default as IconSearch }     from '~icons/material-symbols/search'
export { default as IconFilter }     from '~icons/material-symbols/filter-alt-outline'
export { default as IconSend }       from '~icons/material-symbols/send-outline'
export { default as IconCopy }       from '~icons/material-symbols/content-copy'
export { default as IconPaste }      from '~icons/material-symbols/content-paste'
export { default as IconUpload }     from '~icons/material-symbols/upload-file-outline'
export { default as IconDownload }   from '~icons/material-symbols/download'
export { default as IconLink }       from '~icons/material-symbols/link'
export { default as IconLogout }     from '~icons/material-symbols/logout'
export { default as IconSettings }   from '~icons/material-symbols/settings-outline'

/* ── Keuangan (domain inti Kainest) ──────────────────────────── */
export { default as IconWallet }      from '~icons/material-symbols/account-balance-wallet-outline'
export { default as IconMoney }       from '~icons/material-symbols/payments-outline'
export { default as IconCard }        from '~icons/material-symbols/credit-card-outline'
export { default as IconSavings }     from '~icons/material-symbols/savings-outline'
export { default as IconReceipt }     from '~icons/material-symbols/receipt-outline'
export { default as IconReceiptSplit} from '~icons/material-symbols/receipt-long-outline'
export { default as IconTrendUp }     from '~icons/material-symbols/trending-up'
export { default as IconTrendDown }   from '~icons/material-symbols/trending-down'
export { default as IconChart }       from '~icons/material-symbols/bar-chart'

/* ── AI ──────────────────────────────────────────────────────── */
export { default as IconAi }    from '~icons/material-symbols/auto-awesome-outline'
export { default as IconIdea }  from '~icons/material-symbols/lightbulb-outline'
export { default as IconBolt }  from '~icons/material-symbols/bolt'

/* ── Status & umpan balik ────────────────────────────────────── */
export { default as IconWarning }    from '~icons/material-symbols/warning-outline'
export { default as IconInfo }       from '~icons/material-symbols/info-outline'
export { default as IconInbox }      from '~icons/material-symbols/inbox-outline'
export { default as IconStar }       from '~icons/material-symbols/star'
export { default as IconStarOutline} from '~icons/material-symbols/star-outline'
export { default as IconClock }      from '~icons/material-symbols/schedule'

/* ── Komunikasi & notifikasi ─────────────────────────────────── */
export { default as IconBell }     from '~icons/material-symbols/notifications-outline'
export { default as IconBellAlert} from '~icons/material-symbols/notifications-active-outline'
export { default as IconBellOff }  from '~icons/material-symbols/notifications-off-outline'
export { default as IconChat }     from '~icons/material-symbols/chat-outline'
export { default as IconForum }    from '~icons/material-symbols/forum-outline'
export { default as IconMail }     from '~icons/material-symbols/mail-outline'
export { default as IconAnnounce } from '~icons/material-symbols/campaign-outline'
export { default as IconRelease }  from '~icons/material-symbols/rocket-launch-outline'

/* ── Konten & berkas ─────────────────────────────────────────── */
export { default as IconDocument }  from '~icons/material-symbols/description-outline'
export { default as IconChecklist } from '~icons/material-symbols/checklist'
export { default as IconArchive }   from '~icons/material-symbols/inventory-2-outline'
export { default as IconImage }     from '~icons/material-symbols/image-outline'
export { default as IconCalendar }  from '~icons/material-symbols/calendar-month-outline'
export { default as IconTag }       from '~icons/material-symbols/label-outline'

/* ── Pengguna & pasangan ─────────────────────────────────────── */
export { default as IconUser }    from '~icons/material-symbols/person-outline'
export { default as IconUsers }   from '~icons/material-symbols/group-outline'
export { default as IconAccount } from '~icons/material-symbols/account-circle-outline'
export { default as IconHeart }   from '~icons/material-symbols/favorite-outline'
export { default as IconWave }    from '~icons/material-symbols/waving-hand-outline'

/* ── Keamanan & perangkat ────────────────────────────────────── */
export { default as IconLock }   from '~icons/material-symbols/lock-outline'
export { default as IconKey }    from '~icons/material-symbols/key-outline'
export { default as IconShield } from '~icons/material-symbols/shield-outline'
export { default as IconEye }    from '~icons/material-symbols/visibility-outline'
export { default as IconEyeOff } from '~icons/material-symbols/visibility-off-outline'
export { default as IconQr }     from '~icons/material-symbols/qr-code-2'
export { default as IconPhone }  from '~icons/material-symbols/smartphone-outline'

/* ── Tema ────────────────────────────────────────────────────── */
export { default as IconSun }  from '~icons/material-symbols/light-mode-outline'
export { default as IconMoon } from '~icons/material-symbols/dark-mode-outline'
export { default as IconWeb }  from '~icons/material-symbols/polyline-outline'   /* untaian jaring — tema Spidey */
