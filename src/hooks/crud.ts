import { watch, inject, Ref } from "vue";

export function useCrud() {
	// 新增打开、编辑详情获取后
	function onUpsertOpened(callback?: Function) {
		// 新增、编辑
		const upsert = inject<any>("upsert");

		if (upsert) {
			watch(
				() => upsert.isLoaded,
				(s: Ref) => {
					if (s.value) {
						if (callback) {
							callback(upsert);
						}
					}
				},
				{
					immediate: true,
					deep: true
				}
			);
		}
	}

	// 对话框全屏切换
	function onDialogFullscreen(callback?: Function) {
		const dialog = inject<any>("dialog");

		if (dialog) {
			watch(
				() => dialog.fullscreen,
				() => {
					if (callback) {
						callback();
					}
				},
				{
					immediate: true,
					deep: true
				}
			);
		}
	}

	return { onUpsertOpened, onDialogFullscreen };
}
